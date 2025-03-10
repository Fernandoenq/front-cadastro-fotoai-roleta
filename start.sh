#!/bin/bash
set -e  # Faz o script parar se algum comando falhar

cd /home/ec2-user/front-cadastro-fotoai-roleta  # Caminho do projeto

# 🔹 Atualiza pacotes e instala dependências
sudo yum update -y
sudo yum install -y nginx certbot python3-certbot-nginx nodejs git cronie

# 🔹 Garante que o serviço de crontab está ativo
sudo systemctl enable crond
sudo systemctl start crond

# 🔹 Garante que o Nginx esteja ativo
sudo systemctl enable nginx
sudo systemctl start nginx || true  # Ignora erro se o Nginx não iniciar

# 🔹 Garante que a pasta de build existe antes de copiar
if [ ! -d "dist" ]; then
    echo "❌ ERRO: A pasta 'dist/' não existe. Certifique-se de rodar 'npm run build' antes de executar o script."
    exit 1
fi

# 🔹 Criando diretório exclusivo para esse projeto
sudo mkdir -p /var/www/bradesco-atm
sudo rm -rf /var/www/bradesco-atm/*  # Remove arquivos antigos
sudo cp -r dist/* /var/www/bradesco-atm/

# 🔹 Configuração do Nginx para esse novo projeto
sudo tee /etc/nginx/conf.d/bradesco-atm.conf > /dev/null <<EOF
server {
    listen 80;
    server_name bradesco-atm.picbrand.dev.br;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name bradesco-atm.picbrand.dev.br;

    ssl_certificate /etc/letsencrypt/live/bradesco-atm.picbrand.dev.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bradesco-atm.picbrand.dev.br/privkey.pem;

    root /var/www/bradesco-atm;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    error_page 404 /404.html;
}
EOF

# 🔹 Testa e inicia o Nginx
sudo nginx -t
sudo systemctl restart nginx || true  # Ignora erro se não rodar

# 🔹 Verifica se o Certificado já existe
if [ -f "/etc/letsencrypt/live/bradesco-atm.picbrand.dev.br/fullchain.pem" ]; then
    echo "✅ Certificado SSL já existe. Pulando a geração."
else
    echo "⚡ Gerando certificado SSL..."
    sudo certbot certonly --nginx -d bradesco-atm.picbrand.dev.br --non-interactive --agree-tos -m seuemail@exemplo.com
fi

# 🔹 Testa e reinicia o Nginx com SSL ativado
sudo nginx -t
sudo systemctl restart nginx

# 🔹 Configura a renovação automática do certificado SSL
echo "0 0 * * * certbot renew --quiet && systemctl restart nginx" | sudo crontab -

echo "✅ Setup concluído! O React Vite está rodando com HTTPS."

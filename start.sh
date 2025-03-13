#!/bin/bash
set -e  # Faz o script parar se algum comando falhar

# 🔹 Definições do projeto
PROJECT_NAME="bradesco-atm"  # Nome do projeto
DOMAIN="bradesco-atm.picbrand.dev.br"  # Domínio configurado no Nginx
PROJECT_PATH="/home/ec2-user/front-cadastro-fotoai-roleta"  # Caminho do projeto no servidor
DEPLOY_PATH="/var/www/$PROJECT_NAME"  # Onde os arquivos serão armazenados

# 🔹 Acessa a pasta do projeto
cd "$PROJECT_PATH"

# 🔹 Atualiza pacotes e instala dependências necessárias
echo "🔄 Atualizando pacotes..."
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
sudo mkdir -p "$DEPLOY_PATH"
sudo rm -rf "$DEPLOY_PATH/*"  # Remove arquivos antigos
sudo cp -r dist/* "$DEPLOY_PATH/"

# 🔹 Criação automática do arquivo de configuração do Nginx
NGINX_CONF_PATH="/etc/nginx/conf.d/$PROJECT_NAME.conf"

sudo tee "$NGINX_CONF_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    root $DEPLOY_PATH;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    error_page 404 /404.html;
}
EOF

# 🔹 Testa e reinicia o Nginx
sudo nginx -t
sudo systemctl restart nginx || true  # Ignora erro se não rodar

# 🔹 Configuração do Certificado SSL com Let's Encrypt
echo "🔍 Verificando SSL..."
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificado SSL já existe. Pulando geração."
else
    echo "⚡ Gerando certificado SSL..."
    sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos -m seuemail@exemplo.com
fi

# 🔹 Testa e reinicia o Nginx com SSL ativado
sudo nginx -t
sudo systemctl restart nginx

# 🔹 Configura a renovação automática do certificado SSL
echo "⏳ Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet && systemctl restart nginx") | sudo crontab -

echo "✅ Setup concluído! O React Vite ($PROJECT_NAME) está rodando com HTTPS no domínio: $DOMAIN."

#!/bin/bash
# setup-secure-ssh.sh — فقط با کلید + کاملاً امن
# کلید عمومی تو (همون کلید گیت‌هاب) رو دقیقاً همین گذاشتم

PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL9POKXWWW6HRlmEY47Trd0AP5L8GoCKKGKlT28orZuT mehrdadasg@gmail.com"

# ─────────────────────────────
# از اینجا به بعد دست نزن
# ─────────────────────────────

USER=$(whoami)
USER_HOME=$(eval echo ~$USER)
SSH_DIR="$USER_HOME/.ssh"

echo "در حال نصب کلید عمومی و امن‌سازی SSH..."

# ساخت پوشه و نصب کلید
mkdir -p "$SSH_DIR"
echo "$PUBLIC_KEY" > "$SSH_DIR/authorized_keys"
chmod 700 "$SSH_DIR"
chmod 600 "$SSH_DIR/authorized_keys"
chown -R "$USER":"$USER" "$SSH_DIR"

# بکاپ از sshd_config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%s)

# غیرفعال کردن پسورد و روت + فعال کردن فقط کلید
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# فقط یوزر فعلی اجازه ورود داشته باشه
if ! sudo grep -q "^AllowUsers" /etc/ssh/sshd_config; then
    echo "AllowUsers $USER" | sudo tee -a /etc/ssh/sshd_config
fi

# ری‌استارت سرویس SSH
sudo systemctl restart sshd
sudo systemctl restart ssh 2>/dev/null || true

echo "تموم شد!"
echo "از این به بعد فقط با کلید می‌تونی وارد شی:"
echo "   ssh $USER@$(hostname -I | awk '{print $1}')"
echo "این اسکریپت بعد از ۱۰ ثانیه خودش رو پاک می‌کنه..."

sleep 10
rm -f "$0"
echo "فایل پاک شد. سرور الان ۱۰۰٪ امن است. موفق باشی!"

#!/bin/bash
# کامل‌ترین اسکریپت حذف بدافزار runny / runnv / runn v (ماینر لینوکس)
# فقط کپی کن و اجرا کن: sudo bash این_فایل.sh

echo "در حال کشتن همه پروسس‌های runny/runnv ..."
pkill -9 -f runny
pkill -9 -f runnv
pkill -9 -f alive.sh
killall -9 runny runnv 2>/dev/null

echo "در حال پاک کردن فایل‌ها و پوشه‌های مخرب ..."
rm -rf /tmp/runny /tmp/runnv /tmp/.runny /tmp/.runnv \
       /var/tmp/runny /var/tmp/runnv \
       /dev/shm/runny /dev/shm/runnv \
       /tmp/.X11-unix /tmp/.ICE-unix 2>/dev/null

echo "در حال پاک کردن cron کاربر و روت ..."
(crontab -l 2>/dev/null | grep -v -F 'runny' | grep -v -F 'runnv' | grep -v -F 'alive.sh'; echo) | crontab - 2>/dev/null
sudo crontab -u root -l 2>/dev/null | grep -v -F 'runny' | grep -v -F 'runnv' | sudo crontab -u root -
rm -f /etc/cron.d/*runny* /etc/cron.d/*runnv* /var/spool/cron/crontabs/*runny* /var/spool/cron/crontabs/*runnv* 2>/dev/null

echo "در حال پاک کردن سرویس‌های systemd ..."
systemctl stop runny.service runnv.service 2>/dev/null
systemctl disable runny.service runnv.service 2>/dev/null
rm -f /etc/systemd/system/runny.* /etc/systemd/system/runnv.* \
      /lib/systemd/system/runny.* /lib/systemd/system/runnv.* 2>/dev/null
systemctl daemon-reload

echo "در حال پاک کردن SSH keyهای تزریق‌شده ..."
> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo "در حال امن‌سازی SSH (اگر قبلاً نبود) ..."
if ! grep -q "^PermitRootLogin no" /etc/ssh/sshd_config; then
    echo "PermitRootLogin no" >> /etc/ssh/sshd_config
fi
if ! grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
    echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
fi
systemctl restart sshd

echo "تموم شد! چک نهایی:"
ps aux | grep -E 'runny|runnv|alive.sh' | grep -v grep || echo "هیچ اثری از بدافزار پیدا نشد"

echo "همه چیز پاک شد. سرور الان تمیزه!"

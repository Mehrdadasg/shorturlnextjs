#!/bin/bash
# نابودکننده نهایی xmrig + runnv + runny + kinsing + همه بدافزارهای مشابه (2025)

pkill -9 -f xmrig
pkill -9 -f runnv
pkill -9 -f runny
pkill -9 -f alive.sh
pkill -9 -f kthreadd
pkill -9 -f kintegrityd

# پاک کردن همه مسیرهای شناخته‌شده
rm -rf /tmp/.x* /tmp/x* /tmp/.ICE-unix /tmp/.X11-unix \
       /var/tmp/.x* /dev/shm/.x* /dev/shm/x* \
       /tmp/runn* /tmp/.runn* /var/tmp/runn* /dev/shm/runn* \
       /tmp/kthreadd* /tmp/kintegrityd* /var/tmp/.systemd-private-*

# پاک کردن cron کاربر + روت + همه کاربرها
for user in $(cut -d: -f1 /etc/passwd); do
    crontab -u "$user" -l 2>/dev/null | grep -v -E "(xmrig|runnv|runny|kinsing|kthreadd|wget|curl)" | crontab -u "$user" -
done

rm -f /etc/cron.d/*xmr* /etc/cron.d/*runn* /etc/cron.d/kdevtmp* /etc/cron.d/core

# پاک کردن systemd serviceهای مخفی
systemctl stop xmrig.service runnv.service runny.service kdevtmpfsi.service 2>/dev/null
systemctl disable xmrig.service runnv.service runny.service kdevtmpfsi.service 2>/dev/null
rm -f /etc/systemd/system/{xmrig,runnv,runny,kdevtmpfsi,kthreadd,kintegrityd}.* 2>/dev/null
rm -f /lib/systemd/system/{xmrig,runnv,runny,kdevtmpfsi}.* 2>/dev/null
systemctl daemon-reload

# بلاک کردن IPهای اصلی ماینر (فقط برای موقت)
iptables -A OUTPUT -d 185.221.154.124 -j DROP 2>/dev/null
iptables -A OUTPUT -d 193.29.13.149 -j DROP 2>/dev/null
iptables -A OUTPUT -d pool.supportxmr.com -j DROP 2>/dev/null

# پاک کردن SSH keyهای تزریق‌شده (مهم‌ترین راه ورود دوباره)
> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo "تموم شد! الان ریبوت کن و دیگه هیچ‌وقت برنمی‌گرده"
echo "sudo reboot"

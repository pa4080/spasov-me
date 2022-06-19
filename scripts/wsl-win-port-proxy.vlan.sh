#!/bin/bash

# @author      Spas Z. Spasov
# @home	       https://askubuntu.com/a/1394951/566421
# @version     1.0
# @description Hybrid Bash/PowerShell script that creates port proxy of WSL2`s (virtual network) port to a Windows` public port.
#              Place the cript in '~/bin/wsl-win-port-proxy.sh' and use it as shell command.
# @parameters  $1 = default: 8080 => WSL Port (source)
#              $2 = default: 8080 => Win Port (destination)

wsl_win_proxy() {
    wsl_ip="$(ip route | grep -oP '^.*src \K[0-9\.]+')"
    [[ -z $1 ]] && wsl_port="8080" || wsl_port="$1"

    win_ip="0.0.0.0"
    [[ -z $2 ]] && win_port="8080" || win_port="$2"

    rule_name="Inbound TCP ${win_port}"
    win_get_fw_rule_cmd="Get-NetFirewallRule | Where { \$_.DisplayName -eq '${rule_name}' }"
    win_new_fw_rule_cmd="New-NetFirewallRule -DisplayName '${rule_name}' -Direction Inbound -Action Allow -Protocol TCP -LocalPort ${win_port}"

    if ! netsh.exe interface portproxy show all | grep -q -P "${win_ip}\s+${win_port}\s+${wsl_ip}\s+${wsl_port}"
    then
        powershell.exe Start-Process -Verb runAs -FilePath "netsh.exe" \
            -ArgumentList "interface","portproxy","add","v4tov4",\
                "listenport=$win_port","listenaddress=$win_ip",\
                "connectport=$wsl_port","connectaddress=$wsl_ip"

        if [[ $? -eq 0 ]]
        then
            echo "Port proxy '${win_ip}:${win_port} > ${wsl_ip}:${wsl_port}' is created."
        fi

        if ! powershell.exe ${win_get_fw_rule_cmd} | grep -q "$rule_name"
        then
            echo "Open PowerShell as Admin and create the following firewall rule:"
            echo -e '\033[1;33m'"$win_new_fw_rule_cmd"'\033[0m'
        fi

    fi
}
wsl_win_proxy "$1" "$2"

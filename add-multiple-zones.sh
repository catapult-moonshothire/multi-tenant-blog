for domain in $(cat domains.txt); do
    printf "Adding ${domain}:\n"

    curl https://api.cloudflare.com/client/v4/zones \
    --header "Authorization: Bearer UoiSTEhrMcMCot7uybORj96uA54nQcmU9GmlCp_R" \
    --header "Content-Type: application/json" \
    --data '{
      "account": {
        "id":"885951ec5146fdbdf988a5659ad5d904"
      },
      "name": "'"$domain"'",
      "type": "full"
    }'

    printf "\n\n"
  done
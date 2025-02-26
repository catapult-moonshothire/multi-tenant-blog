# DNS Configuration Guide

## Main Domain (inscribe.so)

Add these records to your domain registrar:

A Record:

- Host: @ or inscribe.so
- Points to: Your server IP

CNAME Record:

- Host: www
- Points to: inscribe.so

## Wildcard Subdomain

Add this record to allow any subdomain:

- Type: A
- Host: \*
- Points to: Your server IP

## Custom Domains (like godsofgrowth.com)

Tell users to add these records to their domain registrar:

A Record:

- Host: @
- Points to: Your server IP

CNAME Record (optional):

- Host: www
- Points to: their domain (e.g., godsofgrowth.com)

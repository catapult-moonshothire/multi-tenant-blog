# DNS Configuration Guide

## Main Domain (xxyy.in)

Add these records to your domain registrar:

A Record:

- Host: @ or xxyy.in
- Points to: Your server IP

CNAME Record:

- Host: www
- Points to: xxyy.in

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

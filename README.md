# Latopa baterijas lietiņa

Discord bots un Api lai parādītu mana laptopa baterijas līmeni

### cron skripta kods

```sh
#!/bin/sh
# ja tev ir vairāk par 1 bateriju... vieglas smiltis
ACPI_DATA=$(acpi -b)

# ievadi pareizu URL uz api endpointu, ja nav localhost
# kā arī to pašu tokenu ko kas .env failā
curl -X POST localhost:3000/thinkpad/send-acpi \
  -H 'Content-Type: application/json' \
  -d '{
    "token":"TOKENS ŠEIT",
    "text": "'"$ACPI_DATA"'"
  }'
```

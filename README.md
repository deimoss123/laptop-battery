# Latopa baterijas lietiņa

Discord bots un Api lai parādītu mana laptopa baterijas līmeni

### Kā palaist

```sh
git clone https://github.com/deimoss123/laptop-battery
cd laptop-battery
```

Ieinstalē paciņas

```sh
bun install
```

Izveido `.env` failu, izmantojot `.env.example` kā piemēru, un ievadi vajadzīgās vērtības

```sh
cp .env.example .env
```

Palaid!

```sh
bun start
```

### cron skripta kods

Šito jāuztāda kā cronu kas iet reizi minūtē

```sh
#!/bin/sh
# ja tev ir vairāk par 1 bateriju... vieglas smiltis
ACPI_DATA=$(acpi -b)

# ievadi pareizu URL uz api endpointu, ja nav localhost
# kā arī to pašu tokenu ko kas .env failā
curl -X POST localhost:3000/thinkpad/send-acpi \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "TOKENS ŠEIT",
    "text": "'"$ACPI_DATA"'"
  }'
```

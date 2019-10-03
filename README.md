# LogBDE_v2
Meteor, React, Mongo, Antd

j'ai aussi adapté ca pour l'UTT avec useraccounts : [accounts-utt](https://atmospherejs.com/jav/accounts-utt)

[Voir le site LogBDE](https://log-dev.apps.uttnetgroup.fr/)

## Pré-requis

Une base de données MongoDB.

## Configuration

La configuration est intégralement passée en variables d'environnement, telles que décrites dans le tabelau ci-dessous.

|Variable|Type|Description|
|----|----|----|
|MONGO_URL|URI|Chaîne de connexion à la base de données|
|ROOT_URL|URL|URL de base de l'application|
|CLIENT_ID|Integer|ID d'application EtuUTT|
|SECRET_ID|Hex string|Clef secrète d'application EtuUTT|
|ADMINS_STUDENTID|Comma-separated integers|Ids étudiant des administrateurs|
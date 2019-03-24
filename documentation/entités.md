# Entités

## Propriété

Nom
Roles:
  Liste de rôles, avec leurs droits et restrictions associés
Entités fille:
  Liste d'entités filles, avec leurs paramètres associés
Membres:
  Liste de membres. Chaque memmbres à des rôle, chaque role à une période d'attribution.

Exemple:

UNG
Roles:
  Président:
    Droits: tout
    Période par défaut: Jusqu'à prochaine nomination
    Restrictions: unique
  Respo log: 
    Droits: gestion de l'inventaire
    Période par défaut: Période actuelle
    Restrictions: aucune
Entités fille:
  GameUTT
  UA
Membres:
  Jane Doe:
    Roles:
      Président: 
        Période d'attribution: Jusqu'à prochaine nomination
  John Doe:
    Roles:
      Respo Logistique:
        Période d'attribution: P18
   
Une entité dispose également des objets suivant:
  un inventaire
  un/des espaces de stockage
  un/des evenements

## Fonctionnalité

Un rôle possède des caractéristiques, dont
  - restrictions (par exemple role unique)
  - période par défaut
  - droits

Une période peut être une période nommée, ou une plage de temps

Publique / privé: une entité peut être privée, non visible aux utilisateurs standards. Pour rejoindre une entité privée, il faut être explicitement invité dans cette entité.

La création d'une nouvelle entité est un droit attribué par les administrateurs (voir administrateurs)

Une entité dispose également d'un ensemble de paramètres, disponibles depuis le menu de gestion:
  - nom
  - image
  - background color (permet de différencier rapidement l'entité utilisé actuellement par l'utilisateur)

Période d'accès à une entité
  Période
  Jusqu'à changement (Exemple: président d'une asso)
  Période par défaut d'un rôle

Partage de l'inventaire d'une entité fille vers une entité mère (option, à la création de l'entité fille)
  Maitre: entité mère ou fille: possède la décision finale concernant le partage d'inventaire
  Peut être overwritten par les admins
  Options:
    Maitre: mère
      Mère ne partage pas / fille ne partage pas : non partagé
      Mère ne partage pas / fille partage        : non partagé
      Mère partage        / fille ne partage pas : partagé
      Mère partage        / fille partage        : partagé
    Maitre: fille
      Mère ne partage pas / fille ne partage pas : non partagé
      Mère ne partage pas / fille partage        : non partagé ?
      Mère partage        / fille ne partage pas : non partagé
      Mère partage        / fille partage        : partagé




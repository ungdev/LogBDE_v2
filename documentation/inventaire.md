# Type d'objets

# Item

## Propriétés:

Les champs marqués d'un ~ sont obligatoires

  ~Nom
  ~Propriétaire: Entité
  Image
  Inventaire:
    Emplacement de stockage: Quantité
    OU
    Liste d'objets
  Autorisation d'emprunt
    Entité: Politique d'attribution
  [Informations additionnelles]
  Utilisation actuelle
    Events
  Etat actuelle de l'objet
  Location (y/n)
  Consommable (y/n)
  Caution (Non consommable):
    Entité: Coût de la caution
  Prix (Consommable / Location)

### Inventaire

L'inventaire est une liste de (emplacement de stockage, quantité). Indiquant ainsi où son les objets et en quelle quantité.

L'emplacement de stockage par défaut et l'emplacement de stockage par défaut de l'entité propriétaire.

Lors de la visualisation 


### Quantité

Présent dans l'inventaire
  Par emplacement
Emprunté
  Par évènements
Total
Si l'objet représente une catégorie, ces quantités représentent la somme des sous objets

Graphe d'utilisation de l'objet (graphe temporelle d'utilisation)

### Emplacements de stockage

Ce champ est une liste d'emplacements de stockage

Si l'item est un objet:
  - cette liste représente l'emplacement des différents

Si l'item est un groupe d'objet:
  - cette liste représente la liste des emplacements des objets / groupes d'objets
  - le premier item de la liste représente l'emplacement par défaut des sous-objets


### Fonctions
  Ajout d'un / plusieurs objets
  Suppression d'un / plusieurs objets
  Edition d'objets (Quantité)

### Fonctionnalités

Politique d'attribution:
  Interdit
  Autorisation manuelle
  Autorisation automatique (avec délai d'autorisation, pour permettre à l'entité d'invalider une demande)

Caution conditionnelle (par exemple pas de caution entre le BDE et l'UNG, ou entre le BDE et ses clubs)

Lorsqu'un groupe d'objet possède des objets qui ont des propriétaires différents (exemple rallonge UNG/BDE), proprietaire liste les différents propriétaires
De même pour l'utilisation actuelle et les emplacements de stockage
Un groupe d'objets ne peut contenir des objets à la fois consommables et non consommables ? (Si le cas, emprunt par défaut des objets non consommables)
Informations additionnelles peut contenir soit du texte, soit d'autres propriété (par exemple, nombre de trou dans une multiprise)

Gestion des droits d'emprunts
  Groupes peuvent ou non emprunter un certain type d'objet
  
Autorisation emprunts par defaut, 

Liste des emprunts passés / présent / futur de cette objet (default to présent / futur )

Stockage: possibilité de mettre un stockage indéfini

Si un utilisateur est dans deux entités différentes, possibilité de transférer des objets entre les inventaires différents ?

Espace de stockage:
  - possibilité de partager un espace de stockage avec d'autres entités

Depuis objet: liste des autres entités disposant de ce type d'objet (uniquement depuis emprunts ?)

Objet: possibilité de transférer un objet d'une entité vers une autre

## UI



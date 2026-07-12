export const profile = {
  name: "Eliot Bedel",
  title: "Ingénieur Cybersécurité",
  bio: "J'ai piloté une Red Team et mené des tests d'intrusion durant 3 ans, avant de me tourner vers le management du risque IT. Aujourd'hui, j'accompagne l'identification et la maîtrise des risques sur des périmètres applicatifs et des activités critiques, pour offrir une vision 360° du risque cyber. Pour ce faire, j'allie l'expertise technique offensive à une approche stratégique de protection des SI. Je transforme ces connaissances en leviers métiers, via des analyses de risques tout en conseillant sur la conformité et la maturité SSI, afin de traduire la complexité technique en risques business actionnables.",
  contact: {
    mobile: "06 33 67 85 61",
    email: "[email-supprime]",
    address: "Nantes / Carquefou (44)",
    permis: "A, B, véhicule",
  },
};

export const experiences = [
  {
    role: "Consultant Cybersécurité GRC",
    company: "UTECH, Nantes",
    period: "Depuis jan. 2026",
    items: [
      "Management du risque",
      "Analyse d'architecture et postures de sécurité",
      "Structuration de la gouvernance des risques",
      "Centralisation et priorisation des plans de traitement",
    ],
  },
  {
    role: "Consultant Cybersécurité Offensif",
    company: "U GIE IRIS, Nantes",
    period: "Depuis nov. 2022",
    items: [
      "Pilotage des centres de services Audit et réalisation de tests d'intrusion",
      "Chefferie de projet et gestion de programmes",
      "Suivis des vulnérabilités",
      "Développement d'outils à usage interne",
      "Gestion de crise et réponse à incident",
    ],
  },
  {
    role: "Apprenant Consultant Cybersécurité",
    company: "Tryade, Nantes",
    period: "2021 - 2022",
    items: [
      "Développement d'offres cybersécurité",
      "Support niveau 3",
      "Accompagnement de projets sécurisation & remédiation SI",
      "Pentest infrastructure",
      "Accompagnement à la réponse à incident",
    ],
  },
  {
    role: "Apprenant Administrateur Systèmes et Réseaux",
    company: "Sercel, Nantes",
    period: "2019 - 2021",
    items: [
      "Gestion et mise en place du projet Netwrix Auditor",
      "Gestion d'un parc informatique : 2 300 PC répartis sur 15 sites à l'international",
      "Fusion des deux domaines Active Directory de l'entreprise",
    ],
  },
  {
    role: "Apprenant Technicien Supérieur de Support Informatique",
    company: "Sercel, Nantes",
    period: "2017 - 2019",
    items: [
      "IT Support / Exploitation d'un parc informatique de 500 PC répartis sur 4 sites",
      "Assistance : utilisateurs, dépannages, migration Windows 10",
      "Maintenance du parc informatique de l'entreprise",
      "Support Niveaux 1 & 2 et exploitation de backups",
    ],
  },
];

export const education = [
  {
    period: "2021 - 2022",
    title: "Expert en Sécurité Digitale",
    school: "ENI Ecole Informatique, Nantes",
    detail: "Titre RNCP de niveau VII — en alternance",
  },
  {
    period: "2019 - 2021",
    title: "Administrateur Systèmes et Réseaux",
    school: "ENI Ecole Informatique, Nantes",
    detail: "Titre RNCP de niveau VI — en alternance",
  },
  {
    period: "2017 - 2019",
    title: "Technicien Supérieur de Support Informatique",
    school: "ENI Ecole Informatique, Nantes",
    detail: "Titre RNCP de niveau III — en alternance",
  },
  {
    period: "2016",
    title: "Bac STI2D, Option SIN",
    school: "Mention bien",
    detail: "",
  },
];

export const certifications = [
  {
    name: "GIAC GWAPT",
    org: "SANS Institute",
    fullName: "GIAC Web Application Penetration Tester",
    detail:
      "Tests d'intrusion d'applications web : injections SQL, XSS, CSRF, attaques sur l'authentification et les sessions, méthodologie complète avec Burp Suite.",
  },
  {
    name: "Pro Lab Zephyr",
    org: "Hack The Box",
    fullName: "Professional Lab — Red team Active Directory",
    detail:
      "Opération red team multi-domaines : attaques Kerberos, relais NTLM, mouvement latéral et pivoting jusqu'à Domain Admin.",
  },
];

export const skills = [
  {
    category: "Cybersécurité",
    items: [
      "Pentest web (OWASP Top 10, injections SQL, XSS, Burp Suite)",
      "Red Team & Active Directory (Kerberos, mouvement latéral, BloodHound)",
      "SOC & Forensic (SIEM Elastic, investigation numérique, analyse de malware)",
      "Réponse à incident & cyberdéfense (hardening, défense en profondeur, référentiels ANSSI)",
      "Gouvernance & risques (EBIOS RM, ISO 27001/27005, ISO 22301, RGPD)",
      "Sécurité des identités & cloud (Active Directory, Azure AD, MFA)",
    ],
  },
  {
    category: "Systèmes et réseaux",
    items: [
      "Virtualisation (HyperV, VMWare)",
      "Active Directory, DHCP, DNS",
      "Réseaux (Cisco, Stormshield)",
      "Powershell et Python",
    ],
  },
];

export const hobbies = {
  tech: "Nouvelles technologies",
  ctf: ["Netwars London : 2e", "LeHack2022 : 2e"],
  other: ["Jeux vidéo compétitif", "Bénévole événementiel (BZHack)"],
};

export const profile = {
  name: "Eliot Bedel",
  title: "Ingénieur Cybersécurité",
  bio: "J'ai piloté une Red Team et mené des tests d'intrusion durant 3 ans, avant de me tourner vers le management du risque IT. Aujourd'hui, j'accompagne l'identification et la maîtrise des risques sur des périmètres applicatifs et des activités critiques, pour offrir une vision 360° du risque cyber. Pour ce faire, j'allie l'expertise technique offensive à une approche stratégique de protection des SI. Je transforme ces connaissances en leviers métiers, via des analyses de risques, des priorisations de vulnérabilités, tout en conseillant sur la conformité et la maturité SSI, afin de traduire la complexité technique en risques business actionnables.",
  keywords: ["Red Team", "GRC", "EBIOS RM", "ISO 27001"],
  contact: {
    mobile: "06 33 67 85 61",
    email: "eliot.bedel.contact@icloud.com",
    address: "Nantes / Carquefou (44)",
    maps: "https://maps.app.goo.gl/56KpnGDwBrJwTuTY9",
    linkedin: "https://www.linkedin.com/in/eliot-bedel/",
  },
};

export const experiences = [
  {
    role: "Consultant Cybersécurité GRC",
    company: "U TECH, Nantes",
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
    company: "U TECH, Nantes",
    period: "2022-2025",
    items: [
      "Auditeur sécurité",
      "Pilotage des centres de services Audit et réalisation de tests d'intrusion",
      "Chefferie de projet et gestion de programmes",
      "Suivi des vulnérabilités",
      "Développement d'outils à usage interne",
      "Gestion de crise et réponse à incident",
    ],
  },
  {
    role: "Apprenant Consultant Cybersécurité",
    company: "Tryade, Nantes",
    period: "2021 - 2022",
    items: [
      "Développement d'offres de cybersécurité",
      "Audit Sécurité SI, Sécurité AD, Maturité SSI (ISO 27002)",
      "Déploiement de solutions de sécurité (identité MS, EDR/XDR, DLP, hardening)",
      "Support niveau 3",
      "Accompagnement de projets de sécurisation & remédiation SI",
      "Pentest infrastructure",
      "Accompagnement à la réponse à incident",
      "Environnements techniques : VMware, Veeam, Azure, Office 365, Linux, Stormshield, ELK, Netwrix",
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
    school: "ENI École Informatique, Nantes",
    detail: "Titre RNCP de niveau VII — en alternance",
  },
  {
    period: "2019 - 2021",
    title: "Administrateur Systèmes et Réseaux",
    school: "ENI École Informatique, Nantes",
    detail: "Titre RNCP de niveau VI — en alternance",
  },
  {
    period: "2017 - 2019",
    title: "Technicien Supérieur de Support Informatique",
    school: "ENI École Informatique, Nantes",
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
      "Méthodologie de pentest web OWASP complète, de la reconnaissance à l'exploitation : injections SQL/NoSQL, XSS, CSRF, SSRF, XXE, SSTI, contournement d'authentification et d'autorisation — avec Burp Suite, ffuf, sqlmap et Metasploit.",
  },
  {
    name: "Pro Lab Zephyr",
    org: "Hack The Box",
    fullName: "Professional Lab — Red Team Active Directory",
    detail:
      "Opération red team multi-domaines : attaques Kerberos, relais NTLM, mouvement latéral et pivoting jusqu'à Domain Admin.",
  },
  {
    name: "CISSP",
    org: "ISC2",
    fullName: "Certified Information Systems Security Professional",
    detail:
      "Référentiel de sécurité de l'information couvrant la gouvernance, la gestion des risques, l'architecture et les opérations de sécurité.",
    status: "En préparation",
  },
  {
    name: "ISO 27005 Risk Manager",
    org: "PECB",
    fullName: "Certified ISO/IEC 27005 Risk Manager",
    detail:
      "Méthodologie de gestion des risques liés à la sécurité de l'information selon la norme ISO/IEC 27005 : identification, analyse, évaluation et traitement des risques.",
    status: "En préparation",
  },
];

export const skills = [
  {
    category: "Red Team",
    items: [
      "Pentest web (injections, XSS/SSRF/XXE, CSRF, logique métier, exploitation binaire BOF)",
      "Active Directory (Kerberoasting, AS-REP Roasting, Pass-the-Hash/Ticket, DCSync, forge de tickets Kerberos, abus ADCS ESC1+, délégation contrainte, BloodHound)",
      "Outils (Impacket, Rubeus, Mimikatz, Certipy, NetExec/CrackMapExec, PowerView, Responder, Burp Suite)",
    ],
  },
  {
    category: "Blue Team",
    items: [
      "SOC & Forensic (SIEM Splunk/Elastic, EDR, forensic mémoire Volatility, analyse de malware)",
      "Réponse à incident & gestion de crise (hardening, défense en profondeur, référentiels ANSSI)",
      "Sécurité des identités & cloud (Active Directory, Azure AD, MFA)",
    ],
  },
  {
    category: "Cloud & Conteneurs",
    items: [
      "AWS IAM",
      "Docker/Kubernetes (breakout, RBAC, abus Kubelet)",
    ],
  },
  {
    category: "IA/LLM Security",
    items: [
      "Red-teaming LLM (jailbreak, data poisoning)",
      "Référentiel OWASP LLM Top 10",
    ],
  },
  {
    category: "GRC",
    items: [
      "Analyse de risques (méthode EBIOS Risk Manager)",
      "Système de management de la sécurité (ISO 27001/27002)",
      "Continuité d'activité (ISO 22301, BIA, PCA/PRA)",
      "Conformité réglementaire (RGPD, CNIL)",
    ],
  },
  {
    category: "Systèmes et réseaux",
    items: [
      "Virtualisation (Hyper-V, VMware, Docker, Kubernetes)",
      "Systèmes (Linux, Windows Server, macOS)",
      "Active Directory, DHCP, DNS",
      "Réseaux (Cisco, Stormshield)",
      "PowerShell et Python",
      "Sauvegarde immuable",
    ],
  },
];

export const hobbies = {
  tech: "Nouvelles technologies",
  ctf: ["NetWars London : 2e", "LeHack 2022 : 2e"],
  other: [
    "Jeux vidéo compétitif",
    "Bénévole événementiel (BZHack)",
    "Piano",
    "Blockchain",
    "Macro-économie",
  ],
};

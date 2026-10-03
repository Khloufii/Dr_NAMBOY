import { MedicalService } from '../types';

export const MEDICAL_SERVICES: MedicalService[] = [
  // ... (tous les services existants, inchangés)
  {
    id: 'general',
    titleFr: 'Médecine Générale & Suivi Familial',
    titleAr: 'الطب العام والتتبع العائلي الشامل',
    shortDescFr: 'Consultations pour adultes et enfants, suivi rigoureux des maladies chroniques (diabète, HTA, asthme) et bilans de santé préventifs complets.',
    shortDescAr: 'استشارات طبية شاملة للأطفال والبالغين، تتبع دقيق للأمراض المزمنة (السكري، ضغط الدم، الربو) وفحوصات وقائية دورية.',
    fullDescFr: `Le pôle de Médecine Générale du Dr. NAMBOY Evrard Simplice à Salé Bettana est le premier rempart pour préserver votre santé et celle de votre famille. Fort d'une solide expérience clinique acquise à Rabat, le Dr. NAMBOY assure une prise en charge holistique, humaine et méthodique.

Que ce soit pour un problème de santé aigu (infection respiratoire, douleurs abdominales, syndrome fébrile) ou pour la gestion au long cours de pathologies chroniques métaboliques et cardiovasculaires, notre cabinet coordonne l'ensemble de votre parcours de soins avec un dossier médical informatisé et confidentiel.`,
    fullDescAr: `يشكل قطب الطب العام للدكتور نامبوي إيفرارد سيمبليس بسلا بطانة حجر الزاوية لصحتكم وصحة أسركم. بفضل خبرة سريرية واسعة راكمها بالرباط، يقدم الدكتور نامبوي رعاية طبية شاملة، إنسانية ومنهجية.

سواء كان الأمر يتعلق بحالة صحية طارئة (التهابات تنفسية، آلام البطن، نوبات الحمى) أو التتبع المستمر للأمراض المزمنة كالسكري وارتفاع ضغط الدم، تضمن العيادة تنسيقاً متكاملاً لكافة مراحل العلاج ضمن ملف طبي إلكتروني آمن وسري.`,
    image: '/images/Dr. NAMBOY en Consultation Thérapeutique.jpeg',
    iconName: 'Stethoscope',
    badgeFr: 'Soins Familiaux',
    badgeAr: 'رعاية عائلية',
    is24h: false,
    indicationsFr: [
      'Suivi régulier du Diabète de type 1 et 2 avec adaptation de l’insulinothérapie ou des antidiabétiques oraux',
      'Contrôle et stabilisation de l’Hypertension Artérielle (HTA) et bilan lipidique (cholestérol)',
      'Affections pédiatriques courantes (bronchiolite, otites, gastro-entérites, suivi vaccinal)',
      'Pathologies respiratoires (asthme, bronchopneumopathies, toux persistantes, allergies)',
      'Bilans de santé préventifs annuels et certificats médicaux d’aptitude physique',
      'Douleurs ostéo-articulaires, lombalgies et pathologies rhumatismales'
    ],
    indicationsAr: [
      'تتبع داء السكري من النوعين الأول والثاني وتعديل جرعات الأنسولين والأدوية',
      'مراقبة وضبط ضغط الدم المرتفع وتوازن الكوليسترول والدهون الثلاثية',
      'أمراض الأطفال الشائعة (التهاب الشعب الهوائية، التهاب الأذن، النزلات المعوية)',
      'أمراض الجهاز التنفسي والربو والسعال المزمن والحساسية الموسمية',
      'فحوصات وقائية سنوية وكشوفات شاملة وشهادات الكفاءة البدنية',
      'آلام المفاصل والعمود الفقري والروماتيزم'
    ],
    equipmentFr: [
      'Tensiomètres électroniques et manométriques de précision médicale calibrés',
      'Oxymètres de pouls professionnels et thermomètres infrarouges de précision',
      'Lecteurs de glycémie instantanée et bandelettes urinaires multiparamétriques',
      'Otoscopes à fibre optique haute luminosité et ophtalmoscopes de dépistage',
      'Nébuliseurs pour aérosolthérapie d’urgence'
    ],
    equipmentAr: [
      'أجهزة قياس ضغط الدم الطبية الإلكترونية والزئبقية المعايرة بدقة',
      'أجهزة قياس تشبع الأكسجين في الدم وموازين حرارة رقمية سريعة',
      'أجهزة قياس السكر الفوري وشرائط الفحص البولي المتعددة المعايير',
      'منظار الأذن بالألياف الضوئية ومنظار قعر العين التشخيصي',
      'أجهزة الرذاذ والاستنشاق الفوري لأزمات التنفس'
    ],
    preparationFr: [
      'Apporter vos ordonnances récentes et la liste exacte de vos médicaments pris au quotidien',
      'Pour un bilan métabolique complet (glycémie, cholestérol), venir de préférence à jeun le matin',
      'Se munir de votre carnet de santé ou des résultats de vos dernières analyses de laboratoire',
      'Préparer par écrit la chronologie de vos symptômes et interrogations pour le médecin'
    ],
    preparationAr: [
      'إحضار الوصفات الطبية السابقة وقائمة الأدوية المتناولة بانتظام',
      'إذا كان الفحص يشمل تحاليل السكر والكوليسترول، يُفضل القدوم على الريق صباحاً',
      'إحضار الدفتر الصحي ونتائج آخر الفحوصات والتحاليل المخبرية',
      'تسجيل تواريخ ظهور الأعراض وأي أسئلة ترغبون في طرحها على الطبيب'
    ],
    procedureFr: [
      'Accueil et enregistrement des paramètres vitaux (tension artérielle, pouls, saturation O2, température, poids)',
      'Anamnèse médicale poussée : historique clinique, antécédents familiaux, mode de vie',
      'Examen clinique complet : auscultation cardio-pulmonaire, examen abdominal, examen ORL et palpation ganglionnaire',
      'Explication claire du diagnostic et remise d’une ordonnance détaillée avec conseils diététiques et d’hygiène de vie',
      'Planification des examens complémentaires (échographie, ECG, bilan sanguin) si nécessaire'
    ],
    procedureAr: [
      'استقبال المريض وقياس المؤشرات الحيوية (الضغط، النبض، نسبة الأكسجين، الحرارة والوزن)',
      'استجواب طبي دقيق : التاريخ المرضي، السوابق العائلية، نمط الحياة والأعراض الحالية',
      'فحص سريري شامل : فحص دقات القلب والرئتين، فحص البطن، فحص الأذن والأنف والحلق',
      'شرح مبسط وواضح للتشخيص وتسليم الوصفة الطبية مع نصائح وقائية وغذائية ملائمة',
      'برمجة الفحوصات التكميلية (فحص بالصدى، تخطيط القلب، تحاليل مخبرية) عند الاقتضاء'
    ],
    faqs: [
      {
        qFr: 'Dois-je obligatoirement prendre rendez-vous pour une consultation de médecine générale ?',
        qAr: 'هل يجب بالضرورة حجز موعد مسبق للاستشارة في الطب العام ؟',
        aFr: 'La prise de rendez-vous est conseillée pour éviter l’attente, mais le cabinet accueille également les consultations sans rendez-vous et les urgences sans interruption.',
        aAr: 'يُنصح بحجز موعد لتفادي الانتظار، لكن العيادة تستقبل أيضاً المرضى بدون موعد مسبق وتتكفل بالحالات الطارئة دون انقطاع.'
      },
      {
        qFr: 'Le Dr. NAMBOY assure-t-il le suivi des nourrissons et des enfants ?',
        qAr: 'هل يقوم الدكتور نامبوي بتتبع صحة الرضع والأطفال ؟',
        aFr: 'Oui, le cabinet prend en charge les nourrissons et les enfants pour les pathologies courantes, la surveillance de la croissance staturo-pondérale et les conseils nutritionnels.',
        aAr: 'نعم، تستقبل العيادة الرضع والأطفال لعلاج مختلف الأمراض، ومتابعة منحنيات النمو والوزن وتقديم الإرشادات الغذائية.'
      }
    ]
  },
  {
    id: 'emergencies',
    titleFr: 'Urgences Médicales 24h/24 & Réanimation',
    titleAr: 'طوارئ طبية 24/24 وعناية مستعجلة',
    shortDescFr: 'Permanence médicale continue 24h/24 et 7j/7 à Salé Bettana. Prise en charge immédiate des détresses aiguës, oxygénothérapie, perfusions, surveillance et sutures.',
    shortDescAr: 'مداومة طبية مستمرة 24 ساعة على مدار الأسبوع بسلا بطانة. تدخل فوري للحالات الحرجة، علاج بالأكسجين، محاليل وريدية وخياطة الجروح.',
    fullDescFr: `L'urgence ne prévient pas. C'est pourquoi le Cabinet Médical du Dr. NAMBOY Evrard Simplice garantit une permanence médicale ininterrompue 24h/24 et 7j/7 au cœur de Salé Bettana. Spécialisé en médecine d'urgence et réanimation d'urgence à Rabat, le Dr. NAMBOY dispose du sang-froid et des compétences techniques requises pour stabiliser les situations aiguës.

Notre salle de soins d'urgence est équipée de matériel lourd : concentrateur d'oxygène, monitoring des paramètres vitaux, matériel d'intubation et de ventilation, défibrillateur et pharmacie d'urgence pour injections intraveineuses immédiates.`,
    fullDescAr: `الحالات الطارئة لا تنتظر، ولهذا توفر العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس مداومة مستمرة على مدار الساعة طيلة أيام الأسبوع في قلب سلا بطانة. انطلاقاً من تكوينه العالي في طب المستعجلات والإنعاش بالرباط، يتمتع الدكتور نامبوي بالخبرة والسرعة اللازمتين للتعامل مع مختلف الحالات الحرجة.

قاعة المستعجلات مجهزة بأحدث المعدات: مولدات الأكسجين الطبي، أجهزة مراقبة الوظائف الحيوية، تجهيزات التنفس الاصطناعي، صدمات القلب، وصيدلية طوارئ متكاملة للحقن الوريدي الفوري.`,
    image: '/images/Urgences=Médicales.jpg',
    iconName: 'HeartPulse',
    badgeFr: 'Permanence 24h/24',
    badgeAr: 'مداومة 24/24',
    is24h: true,
    indicationsFr: [
      'Douleurs thoraciques aiguës, suspicion d’infarctus du myocarde ou d’angine de poitrine',
      'Détresses respiratoires aiguës, crises d’asthme sévères, décompensation BPCO',
      'Traumatismes, plaies ouvertes nécessitant sutures chirurgicales d’urgence sous anesthésie locale',
      'Malaise vagal, syncopes, pertes de connaissance brèves ou vertiges intenses',
      'Fièvres convulsives de l’enfant et déshydratations aiguës',
      'Brûlures thermiques et chimiques, réactions allergiques aiguës (œdème de Quincke, urticaire géant)',
      'Crises hypertensives sévères et céphalées brutales inhabituelles'
    ],
    indicationsAr: [
      'آلام حادة ومفاجئة في القفص الصدري، الاشتباه في الجلطات القلبية والذبحة الصدرية',
      'ضيق حاد في التنفس، نوبات الربو الحادة واختناق القصبات الهوائية',
      'الجروح المفتوحة والإصابات التي تستدعي خياطة جراحية مستعجلة تحت التخدير الموضعي',
      'حالات الإغماء، الدوخة الشديدة وفقدان الوعي المؤقت',
      'الحمى الشديدة والتشنجات لدى الأطفال وحالات الجفاف الحاد',
      'الحروق، الحساسية المفرطة الحادة وانتفاخ الوجه واللسان',
      'الارتفاع الحاد والخطير في ضغط الدم والصداع المفاجئ غير المعتاد'
    ],
    equipmentFr: [
      'Concentrateurs d’oxygène médicaux à haut débit et masques à réserve',
      'Moniteurs multiparamétriques de réanimation (ECG continu, SpO2, PNI, rythme)',
      'Kit complet de petite chirurgie et sutures stériles résorbables et non résorbables',
      'Aspirateurs de mucosités et matériel de libération des voies aériennes',
      'Médicaments injectables d’urgence (bronchodilatateurs, corticoïdes, antiarythmiques, analgésiques)'
    ],
    equipmentAr: [
      'أجهزة توليد الأكسجين الطبي عالي الصبيب وأقنعة الاستنشاق',
      'شاشات مراقبة سريرية متعددة المؤشرات (تخطيط القلب المستمر، الأكسجين، الضغط، النبض)',
      'معدات الجراحة الصغرى وخياطة الجروح المعقمة بمختلف أنواع الخيوط الطبية',
      'أجهزة شفط الإفرازات وفتح المسالك الهوائية',
      'أدوية الحقن المستعجل (موسعات الشعب، كورتيكويد، مضادات اضطراب النبض، مسكنات الآلام القوية)'
    ],
    preparationFr: [
      'En cas d’urgence vitale, ne perdez pas de temps : contactez directement notre ligne 24/7 au +212 7 70 55 82 99',
      'Si possible, amenez la carte d’identité nationale et les traitements habituels du patient',
      'Ne donnez ni à boire ni à manger au patient avant l’avis du médecin urgentiste'
    ],
    preparationAr: [
      'في حالات الخطر الداهم، توجهوا فوراً أو اتصلوا بخط الطوارئ على 212770558299+',
      'إذا أمكن، إحضار البطاقة الوطنية وقائمة الأدوية التي يتناولها المريض',
      'تجنب إعطاء المريض أي طعام أو شراب قبل فحصه من قِبل الطبيب المستعجل'
    ],
    procedureFr: [
      'Triage et évaluation immédiate des constantes vitales dès l’admission',
      'Mise en condition immédiate : oxygénothérapie, voie veineuse périphérique, monitoring cardiorespiratoire',
      'Examens diagnostiques au lit du patient (ECG 12 dérivations, glycémie, échographie d’urgence POCUS)',
      'Administration du traitement d’urgence adapté pour stabiliser l’état du patient',
      'Mise en observation surveillée ou organisation d’un transfert médicalisé si une hospitalisation lourde est requise'
    ],
    procedureAr: [
      'فرز وتقييم فوري للعلامات الحيوية بمجرد وصول المريض إلى العيادة',
      'تثبيت الحالة بشكل عاجل : تزويد بالأكسجين، تركيب محلول وريدي، وصل أجهزة المراقبة',
      'فحوصات سريعة بجانب السرير (تخطيط القلب الفوري، قياس السكر، فحص بالصدى المستعجل)',
      'إعطاء العلاجات والمسكنات المناسبة لتهدئة واستقرار الحالة',
      'المراقبة الطبية المستمرة أو التنسيق مع المستشفيات في حال استدعت الحالة تدخلاً جراحياً كبيراً'
    ],
    faqs: [
      {
        qFr: 'Le cabinet est-il véritablement ouvert au milieu de la nuit ?',
        qAr: 'هل العيادة مفتوحة فعلاً خلال ساعات الليل المتأخرة ؟',
        aFr: 'Oui, une permanence médicale réelle et continue est assurée 24h/24 et 7j/7. Le Dr. NAMBOY et son équipe soignante sont joignables et sur place.',
        aAr: 'نعم، المداومة الطبية فعلية وحقيقية 24 ساعة على مدار الأسبوع ليلاً ونهاراً مع حضور الطاقم الطبي وجاهزيته التامة.'
      },
      {
        qFr: 'Prenez-vous en charge les sutures de coupures et plaies ?',
        qAr: 'هل تقومون بخياطة الجروح العميقة والإصابات ؟',
        aFr: 'Absolument. Nous réalisons les sutures d’urgence sous anesthésie locale stricte, avec nettoyage antiseptique approfondi et vérification vaccinale antitétanique.',
        aAr: 'بالتأكيد. نقوم بخياطة الجروح بدقة وعناية تحت تخدير موضعي تام مع تعقيم شامل وتطعيم ضد الكزاز عند الحاجة.'
      }
    ]
  },
  {
    id: 'imaging',
    titleFr: 'Diagnostics, Échographie, ECG & Holters 24h',
    titleAr: 'التشخيص الطبي، الفحص بالصدى، تخطيط القلب وهولتر 24 ساعة',
    shortDescFr: 'Plateau diagnostique haute précision sur place : échographies abdominales, hépato-biliaires, pelviennes, suivi de grossesse 3D/Doppler, ECG 12 dérivations immédiat, Holter ECG 24h et Holter tensionnel (MAPA).',
    shortDescAr: 'تجهيزات تشخيصية فائقة الدقة بالعيادة : فحص بالصدى للبطن، الكبد، الحوض، تتبع الحمل، تخطيط كهربية القلب (ECG) الفوري، هولتر القلب 24 ساعة وهولتر ضغط الدم (MAPA).',
    fullDescFr: `Disposer des outils de diagnostic modernes sur place est essentiel pour poser un diagnostic rapide sans faire perdre de temps au patient. Le Dr. NAMBOY Evrard Simplice, titulaire de diplômes universitaires de Rabat en échographie générale et d'urgence, réalise lui-même vos examens échographiques et cardiologiques.

Grâce à notre échographe numérique haute définition avec sondes convexe, superficielle et endocavitaire, nous visualisons avec une netteté remarquable les organes abdominaux, la sphère gynéco-obstétricale et les vaisseaux. L'électrocardiogramme 12 dérivations est interprété instantanément.

Pour les pathologies cardiaques et tensionnelles intermittentes, nous proposons également l'enregistrement ambulatoire sur 24 heures : le Holter ECG (surveillance continue du rythme cardiaque) et le Holter tensionnel MAPA (Mesure Ambulatoire de la Pression Artérielle). Ces examens permettent de détecter des anomalies invisibles lors d'une consultation ponctuelle et d'adapter précisément le traitement.`,
    fullDescAr: `إن توفر أحدث أجهزة التشخيص داخل العيادة يضمن تشخيصاً دقيقاً وسريعاً دون إضاعة وقت المريض في التنقل. يتولى الدكتور نامبوي إيفرارد سيمبليس، الحاصل على شواهد جامعية عليا بالرباط في الفحص بالصدى (Échographie)، إجراء كافة الفحوصات بنفسه.

بفضل جهاز الصدى الرقمي المتطور المزود بمجسات متعددة الأبعاد، نوفر صوراً دقيقة لأعضاء البطن، الجهاز التناسلي، وتتبع أطوار الجنين، إضافة إلى تخطيط كهربية القلب (ECG) الفوري وتفسيره في الحين.

كما نوفر خدمة التسجيل الطبي المتنقل على مدى 24 ساعة لتشخيص الحالات القلبية وارتفاع ضغط الدم المتقطع : هولتر القلب (Holter ECG) للمراقبة المستمرة لنبضات القلب، وهولتر ضغط الدم (MAPA) لقياس ضغط الدم على مدار اليوم. تساعد هذه الفحوصات على كشف الاختلالات التي لا تظهر في الفحص العيادي العادي وتعديل العلاج بدقة.`,
    image: '/images/Echographie-cardiaque-ce-que-montre-cet-examen-du-coeur.jpg',
    iconName: 'Activity',
    badgeFr: 'Plateau Moderne + Holters 24h',
    badgeAr: 'تجهيزات متطورة + هولتر 24 ساعة',
    is24h: false,
    indicationsFr: [
      'Échographie abdominale : foie, vésicule biliaire (calculs), pancréas, rate, aorte abdominale',
      'Échographie rénale et vésico-prostatique : calculs rénaux, coliques néphrétiques, hypertrophie de la prostate',
      'Échographie obstétricale : confirmation de vitalité, datation, biométrie fœtale, morphologie et bien-être du bébé',
      'Échographie pelvienne gynécologique : utérus, ovaires, kystes, fibromes et surveillance endométriale',
      'Échographie thyroïdienne et des parties molles (adénopathies, kystes sébacés, hernies)',
      'Électrocardiogramme (ECG) de repos : dépistage des troubles du rythme, ischémie myocardique et surveillance thérapeutique',
      'Holter ECG 24h : palpitations, malaises, syncopes, vertiges à répétition, recherche d’arythmie paroxystique (fibrillation auriculaire), évaluation de l’efficacité d’un traitement antiarythmique',
      'Holter tensionnel MAPA 24h : suspicion d’hypertension artérielle (HTA), HTA blouse blanche, HTA résistante, adaptation du traitement antihypertenseur, évaluation du profil tensionnel nocturne (dipper / non-dipper)'
    ],
    indicationsAr: [
      'فحص الصدى للبطن : الكبد، المرارة (الحصى)، البنكرياس، الطحال والشريان الأورطي',
      'فحص الكلى والمثانة والبروستات : حصى الكلى، المغص الكلوي الحاد وتضخم البروستات',
      'فحص الحمل وتتبع الجنين : نبض الجنين، تحديد عمر الحمل، نمو الأعضاء وسلامة المشيمة',
      'فحص الحوض وأمراض النساء : الرحم، المبيضين، الأكياس، الألياف وبطانة الرحم',
      'فحص الغدة الدرقية والأنسجة الرخوة والانتفاخات',
      'تخطيط كهربية القلب (ECG) : كشف اضطرابات النبض، قصور الشرايين التاجية ومتابعة أدوية القلب',
      'هولتر القلب 24 ساعة (Holter ECG) : الخفقان، الدوار، الإغماء، اضطرابات النبض المتقطعة (الرجفان الأذيني) وتقييم فعالية الأدوية المضادة لاضطراب النظم',
      'هولتر ضغط الدم 24 ساعة (MAPA) : التشخيص الدقيق لارتفاع ضغط الدم، ارتفاع الضغط في العيادة فقط (أثر المعطف الأبيض)، مقاومة العلاج، تعديل جرعات الأدوية الخافضة للضغط وتقييم الضغط الليلي'
    ],
    equipmentFr: [
      'Échographe couleur doppler haute résolution avec sondes multifréquences',
      'Électrocardiographe 12 pistes numérique haute sensibilité avec tracé imprimé',
      'Holter ECG 24h : boîtier numérique multi-canaux avec analyse automatique des arythmies et logiciel de restitution détaillée',
      'Holter tensionnel MAPA 24h : moniteur automatique avec brassard programmable (mesures toutes les 15-30 min le jour et toutes les 30-60 min la nuit)',
      'Négatoscope mural professionnel pour lecture radiographique instantanée',
      'Table d’examen ergonomique capitonnée avec protections hygiéniques à usage unique'
    ],
    equipmentAr: [
      'جهاز فحص بالصدى رقمي متطور مزود بتقنية الدوبلر الملون ومجسات عالية التردد',
      'جهاز تخطيط القلب الرقمي بـ 12 مساراً فائق الحساسية مع طباعة فورية للتقرير',
      'جهاز هولتر القلب 24 ساعة : مسجل رقمي متعدد القنوات مع تحليل تلقائي لاضطرابات النبض وتقرير مفصل',
      'جهاز هولتر ضغط الدم (MAPA) : جهاز قياس آلي مزود بحزام قابل للبرمجة (قياس كل 15-30 دقيقة نهاراً وكل 30-60 دقيقة ليلاً)',
      'جهاز قراءة وتفسير صور الأشعة الصدرية والعظمية (Négatoscope)',
      'سرير فحص طبي مريح ومجهز بأغطية معقمة أحادية الاستعمال'
    ],
    preparationFr: [
      'Pour une échographie abdominale : être strictement à jeun de nourriture depuis 4 à 6 heures (boire un peu d’eau plate reste autorisé)',
      'Pour une échographie pelvienne ou rénale : boire 3 à 4 verres d’eau une heure avant l’examen et ne pas uriner pour garder la vessie pleine',
      'Pour un ECG : porter des vêtements faciles à déboutonner au niveau du torse et éviter d’appliquer des crèmes grasses sur la peau avant l’examen',
      'Pour un Holter ECG 24h : prendre une douche juste avant la pose (le boîtier ne doit pas être mouillé pendant 24h), porter un haut ample, éviter les sources magnétiques (micro-ondes, aimants puissants) et noter sur un carnet l’heure des symptômes ressentis (palpitations, douleurs, essoufflement)',
      'Pour un Holter tensionnel MAPA 24h : porter un vêtement à manches larges, éviter les efforts physiques violents, garder le bras immobile et détendu pendant chaque mesure, ne pas retirer le brassard et ne pas dormir sur le bras équipé'
    ],
    preparationAr: [
      'لفحص البطن بالصدى : الصيام عن الأكل لمدة 4 إلى 6 ساعات قبل الفحص (يُسمح بشرب قليل من الماء)',
      'لفحص الحوض أو الكلى والمثانة : شرب 3 إلى 4 كؤوس من الماء قبل ساعة من الفحص والامتناع عن التبول لتكون المثانة ممتلئة',
      'لتخطيط القلب (ECG) : ارتداء ملابس سهلة الفتح في منطقة الصدر وتجنب وضع مراهم أو كريمات دهنية على الجلد',
      'لهولتر القلب 24 ساعة : الاستحمام قبل تركيب الجهاز (يُمنع تعرض الجهاز للماء لمدة 24 ساعة)، ارتداء ملابس واسعة، تجنب المصادر المغناطيسية وتسجيل أوقات الأعراض (الخفقان، الألم، ضيق التنفس) في دفتر صغير',
      'لهولتر ضغط الدم (MAPA) : ارتداء ملابس بأكمام واسعة، تجنب المجهود البدني العنيف، إبقاء الذراع ثابتة ومسترخية أثناء كل قياس وعدم النوم على الذراع التي تحمل الحزام'
    ],
    procedureFr: [
      'Installation confortable du patient sur la table d’examen',
      'Application d’un gel hypoallergénique conducteur à température ambiante',
      'Exploration méthodique des organes par le Dr. NAMBOY avec explications en temps réel sur l’écran de contrôle',
      'Capture des images clés et prise des mesures biométriques nécessaires',
      'Pour le Holter ECG ou le MAPA : pose des électrodes ou du brassard, programmation du boîtier selon le profil du patient, remise d’un carnet de symptômes et d’un numéro de contact d’urgence',
      'Retour au cabinet après 24 heures pour retrait du dispositif, lecture informatique complète par le Dr. NAMBOY et remise du rapport détaillé avec conclusions et recommandations thérapeutiques',
      'Remise immédiate du compte-rendu médical commenté et des clichés photographiques pour les échographies'
    ],
    procedureAr: [
      'استلقاء المريض براحة تامة على سرير الفحص الطبي',
      'وضع مادة الجل الطبية المعقمة والموصلة للموجات الصوتية',
      'فحص دقيق ومنهجي للأعضاء من قِبل الدكتور نامبوي مع تقديم شروحات مباشرة على الشاشة',
      'التقاط الصور الرئيسية وأخذ القياسات البيومترية الدقيقة',
      'بالنسبة لهولتر القلب أو ضغط الدم : تركيب الأقطاب أو الحزام، برمجة الجهاز حسب حالة المريض وتسليم دفتر الأعراض ورقم هاتف للطوارئ',
      'العودة إلى العيادة بعد 24 ساعة لنزع الجهاز، قراءة كاملة بواسطة الحاسوب من طرف الدكتور نامبوي وتسليم التقرير المفصل مع التوصيات العلاجية',
      'تسليم فوري لتقرير الفحص الطبي الشامل مصحوباً بالصور والشروحات للفحوصات بالصدى'
    ],
    faqs: [
      {
        qFr: 'L’échographie présente-t-elle des risques d’irradiation pour la femme enceinte ou le bébé ?',
        qAr: 'هل يشكل الفحص بالصدى أي خطر إشعاعي على المرأة الحامل أو الجنين ؟',
        aFr: 'Absolument aucun. L’échographie utilise des ultrasons totalement inoffensifs pour la mère et l’enfant, sans aucune radiation ni effet secondaire.',
        aAr: 'لا يوجد أي خطر على الإطلاق. يعتمد الفحص بالصدى على موجات صوتية آمنة تماماً ولا يحتوي على أي أشعة ضارة للأم أو الجنين.'
      },
      {
        qFr: 'Obtient-on le compte-rendu de l’échographie le jour même ?',
        qAr: 'هل أحصل على تقرير الفحص بالصدى في نفس اليوم ؟',
        aFr: 'Oui, le compte-rendu imprimé avec les clichés et les conclusions diagnostiques vous est remis immédiatement à la fin de la consultation.',
        aAr: 'نعم، يتم تسليم التقرير الطبي المطبوع مع الصور والتشخيص النهائي للمريض مباشرة بعد انتهاء الفحص.'
      },
      {
        qFr: 'Le Holter ECG et le MAPA sont-ils douloureux ou dangereux ?',
        qAr: 'هل هولتر القلب وهولتر ضغط الدم مؤلمان أو خطيران ؟',
        aFr: 'Non, ces examens sont totalement indolores et sans aucun risque. Le Holter ECG utilise des électrodes autocollantes et le MAPA un simple brassard gonflable. Vous pouvez vaquer à vos occupations habituelles pendant les 24 heures d’enregistrement.',
        aAr: 'لا، هذان الفحصان غير مؤلمين تماماً ولا يشكلان أي خطر. يستعمل هولتر القلب أقطاباً لاصقة بينما يعتمد هولتر ضغط الدم على حزام قابل للنفخ. يمكنك ممارسة أنشطتك اليومية العادية خلال 24 ساعة من التسجيل.'
      },
      {
        qFr: 'Puis-je prendre une douche pendant un Holter ECG ou un MAPA ?',
        qAr: 'هل يمكنني الاستحمام أثناء حمل جهاز هولتر القلب أو ضغط الدم ؟',
        aFr: 'Non. Le boîtier et les électrodes/brassard ne doivent pas être mouillés pendant les 24 heures d’enregistrement. Il est recommandé de prendre une douche juste avant la pose. Pour le MAPA, vous pouvez éventuellement retirer le brassard quelques minutes mais pas le boîtier.',
        aAr: 'لا. يُمنع تعرض الجهاز والأقطاب أو الحزام للماء خلال 24 ساعة من التسجيل. يُنصح بالاستحمام قبل تركيب الجهاز. بالنسبة لهولتر ضغط الدم يمكن إزالة الحزام لبضع دقائق لكن يجب عدم فصل الجهاز.'
      },
      {
        qFr: 'Que faire si je ressens des palpitations ou un malaise pendant l’enregistrement ?',
        qAr: 'ما الذي يجب فعله عند الشعور بالخفقان أو التوعك أثناء التسجيل ؟',
        aFr: 'Notez précisément l’heure et la nature des symptômes sur le carnet qui vous est remis. Cette information est essentielle pour que le Dr. NAMBOY puisse corréler les symptômes avec les tracés enregistrés et poser un diagnostic précis.',
        aAr: 'سجّل بدقة وقت ونوع الأعراض في الدفتر الذي يُسلَّم لك. هذه المعلومات ضرورية لكي يتمكن الدكتور نامبوي من ربط الأعراض بالتخطيطات المسجلة ووضع تشخيص دقيق.'
      },
      {
        qFr: 'Quand vais-je recevoir les résultats des Holters 24h ?',
        qAr: 'متى سأستلم نتائج فحوصات هولتر 24 ساعة ؟',
        aFr: 'Vous revenez au cabinet 24 heures après la pose pour retirer le dispositif. Le Dr. NAMBOY analyse ensuite les données par ordinateur et vous remet un rapport détaillé généralement dans les 24 à 48 heures suivant le retrait.',
        aAr: 'تعود إلى العيادة بعد 24 ساعة من تركيب الجهاز لنزعه. يقوم الدكتور نامبوي بعد ذلك بتحليل البيانات بواسطة الحاسوب ويسلمك تقريراً مفصلاً خلال 24 إلى 48 ساعة من نزع الجهاز.'
      }
    ]
  },
  {
    id: 'tropical',
    titleFr: 'Maladies Tropicales & Dépistage Paludisme',
    titleAr: 'الأمراض المدارية وكشف الملاريا وطب السفر',
    shortDescFr: 'Diagnostic et prise en charge experte du paludisme (malaria), typhoïde, parasitoses digestives, fièvres inexpliquées et consultations de médecine des voyages.',
    shortDescAr: 'تشخيص وعلاج متخصص للملاريا (البرداء)، حمى التيفوئيد، طفيليات الجهاز الهضمي، الحمى المجهولة واستشارات ما بعد السفر.',
    fullDescFr: `Le Dr. NAMBOY Evrard Simplice possède une expertise approfondie et reconnue dans le diagnostic et le traitement des maladies tropicales et infectieuses. Avec les flux fréquents de voyageurs, étudiants et professionnels entre le Maroc, l'Afrique subsaharienne et d'autres zones d'endémie, une fièvre au retour d'un séjour ne doit jamais être négligée.

Le cabinet est équipé de tests de diagnostic rapide (TDR) et de réactifs permettant d'identifier le Plasmodium falciparum en moins de 15 minutes, prévenant ainsi les formes graves de neuropaludisme grâce à un traitement immédiat et ciblé.`,
    fullDescAr: `يمتلك الدكتور نامبوي إيفرارد سيمبليس خبرة معمقة ومعترفا بها في تشخيص وعلاج الأمراض المدارية والعدوى الفيروسية والبكتيرية. مع تزايد حركة السفر بين المغرب وإفريقيا جنوب الصحراء وباقي الدول، فإن أي ارتفاع في درجات الحرارة بعد العودة من السفر يتطلب انتباهاً خاصاً وتدخلاً سريعاً.

توفر العيادة اختبارات كشف سريعة معتمدة (TDR) تتيح كشف طفيل الملاريا في أقل من 15 دقيقة، مما يسمح ببدء العلاج الدقيق فوراً وحماية المريض من أي مضاعفات خطيرة.`,
    image: '/images/Maladies-Tropicales.jpg',
    iconName: 'Bug',
    badgeFr: 'Dépistage Paludisme',
    badgeAr: 'كشف الملاريا',
    is24h: false,
    indicationsFr: [
      'Fièvre brutale avec frissons intenses, sueurs profuses au retour d’une zone d’endémie palustre',
      'Syndromes fébriles inexpliqués, céphalées tenaces, courbatures et fatigue extrême',
      'Suspicion de fièvre typhoïde, parasitoses intestinales (amibes, giardiase, bilharziose)',
      'Infections cutanées tropicales, prurits et dermatoses post-séjour en pays chaud',
      'Consultation pré-voyage : conseils prophylactiques personnalisés et ordonnance préventive'
    ],
    indicationsAr: [
      'حمى مفاجئة مصحوبة بقشعريرة شديدة وتعرق غزير بعد العودة من السفر',
      'نوبات حمى مجهولة المصاب، صداع حاد، آلام المفاصل وإرهاق عام غير مبرر',
      'الاشتباه في حمى التيفوئيد، الطفيليات المعوية (الأميبا، الجيارديا، البلهارسيا)',
      'الالتهابات الجلدية والحكة والحساسية الناتجة عن المناخات المدارية',
      'استشارة ما قبل السفر : إرشادات وقائية وأدوية التحصين ضد لدغات البعوض'
    ],
    equipmentFr: [
      'Tests de Diagnostic Rapide (TDR) antigéniques certifiés pour le paludisme (Plasmodium)',
      'Microscope optique de laboratoire pour observation de frottis et goutte épaisse',
      'Thermomètres et matériel de prise de sang stérile à usage unique',
      'Arsenal thérapeutique complet d’antipaludiques et d’antibiotiques de référence'
    ],
    equipmentAr: [
      'اختبارات الكشف السريع المعتمدة دولياً لتشخيص الملاريا ومختلف فصائل الطفيليات',
      'مجهر ضوئي مخبري لفحص قطرة الدم الدقيقة والشرائح المجهرية',
      'أدوات معقمة أحادية الاستعمال لسحب الدم والتحاليل الفورية',
      'مخزون دوائي علاجي من مضادات الملاريا والمضادات الحيوية النوعية'
    ],
    preparationFr: [
      'Noter précisément le pays, les villes visitées et les dates exactes de votre voyage',
      'Indiquer au Dr. NAMBOY si vous aviez pris un traitement préventif pendant le voyage',
      'Ne pas prendre d’automédication antibiotique ou antipyrétique avant de réaliser le test sanguin'
    ],
    preparationAr: [
      'تحديد الدول والمدن التي زرتموها وتواريخ السفر بدقة',
      'إخبار الطبيب في حال تناولتم أي أدوية وقائية أثناء رحلتكم',
      'تجنب تناول المضادات الحيوية دون وصفة طبية قبل إجراء فحص الدم لتفادي تغييب نتائج التحليل'
    ],
    procedureFr: [
      'Entretien médical ciblé sur l’historique du voyage, les piqûres d’insectes et les symptômes ressentis',
      'Prélèvement d’une micro-goutte de sang au bout du doigt pour le test rapide TDR',
      'Lecture du résultat sous 15 minutes avec confirmation de l’espèce parasitaire',
      'Prescription et explication du protocole thérapeutique à base de dérivés d’artémisinine',
      'Mise sous surveillance et programmation du contrôle parasitologique de guérison'
    ],
    procedureAr: [
      'استجواب طبي يركز على مسار الرحلة، التعرض للدغات الحشرات وتطور الأعراض',
      'سحب قطرة دم صغيرة من طرف الأصبع لإجراء اختبار الكشف السريع',
      'قراءة النتيجة خلال 15 دقيقة مع تحديد نوع الطفيل بدقة',
      'وصف البروتوكول العلاجي المعتمد وتوضيح طريقة تناول الأدوية بانتظام',
      'متابعة الحالة الصحية وبرمجة موعد تأكيد الشفاء التام'
    ],
    faqs: [
      {
        qFr: 'Combien de temps après le retour de voyage le paludisme peut-il se manifester ?',
        qAr: 'كم من الوقت بعد السفر يمكن أن تظهر أعراض الملاريا ؟',
        aFr: 'Le paludisme peut se déclarer entre 7 jours et plusieurs semaines (voire mois) après la piqûre de moustique. Toute fièvre au retour d’Afrique subsaharienne doit faire suspecter le paludisme jusqu’à preuve du contraire.',
        aAr: 'يمكن أن تظهر أعراض الملاريا بعد أسبوع إلى عدة أسابيع (أو حتى أشهر) من لدغة البعوضة. لذلك، فإن أي حمى بعد العودة من السفر تستدعي فحصاً فورياً.'
      }
    ]
  },
  {
    id: 'women',
    titleFr: 'Santé de la Femme, Contraception & Implants',
    titleAr: 'صحة المرأة، تنظيم الأسرة وكبسولات منع الحمل',
    shortDescFr: 'Suivi gynécologique préventif, pose et retrait d’implants contraceptifs sous-cutanés, conseils personnalisés en contraception orale et accompagnement de la grossesse.',
    shortDescAr: 'متابعة نسائية وقائية، تركيب وإزالة كبسولات منع الحمل تحت الجلد، استشارات اختيار حبوب منع الحمل ومرافقة الحوامل.',
    fullDescFr: `La santé des femmes et le libre choix de leur planning familial sont au cœur des engagements du cabinet du Dr. NAMBOY à Salé Bettana. Notre équipe, composée du médecin et de sages-femmes hautement qualifiées, offre un espace d'écoute bienveillant, discret et respectueux de votre intimité.

Nous assurons la pose et le retrait sécurisés des implants contraceptifs sous-cutanés (efficacité de 3 ans), le conseil sur mesure pour le choix d'une pilule contraceptive adaptée à votre profil hormonal, les bilans gynécologiques préventifs et le suivi attentif de la femme enceinte.`,
    fullDescAr: `تشكل صحة المرأة وحقها في تنظيم أسرتها باطمئنان إحدى الأولويات الأساسية في عيادة الدكتور نامبوي بسلا بطانة. يحرص طاقمنا الطبي والقابلات المؤهلات على توفير فضاء مريح، يتسم بالسرية التامة، الإنصات والاحترام الكامل لخصوصيتكم.

نقدم خدمات وضع وإزالة كبسولات تنظيم النسل تحت الجلد بأمان واحترافية (حماية تمتد لـ 3 سنوات)، استشارات مخصصة لاختيار أنسب حبوب منع الحمل وفق الفحوصات الهرمونية، ومتابعة الحوامل حتى موعد الولادة.`,
    image: '/images/troubles-cognitifs-un-tiers-des-seniors-prend-encore-des-medicaments-prescrits-qui-abiment-le-750x410.webp',
    iconName: 'Baby',
    badgeFr: 'Planning & Implants',
    badgeAr: 'تنظيم الأسرة',
    is24h: false,
    indicationsFr: [
      'Pose, contrôle de positionnement et retrait d’implants contraceptifs sous-cutanés (ex: Implanon)',
      'Conseils personnalisés pour le choix de contraception orale (pilules combinées ou microprogestatives)',
      'Prise en charge des troubles du cycle menstruel, règles douloureuses ou irrégulières',
      'Suivi prénatal mensuel de la femme enceinte avec échographie de surveillance',
      'Dépistage des infections génitales et frottis cervico-vaginaux préventifs',
      'Accompagnement de la ménopause et bilan de santé féminin'
    ],
    indicationsAr: [
      'تركيب، فحص وإزالة كبسولات منع الحمل تحت الجلد (مثل Implanon)',
      'استشارات شخصية لاختيار أنسب حبوب منع الحمل المتوافقة مع طبيعة الجسم',
      'علاج اضطرابات الدورة الشهرية والآلام المصاحبة لها',
      'المتابعة الشهرية للحمل مع فحص بالصدى لمراقبة صحة الجنين',
      'علاج الالتهابات النسائية وإجراء الفحوصات الوقائية الدورية',
      'مواكبة مرحلة سن الأمل والرعاية الصحية الشاملة للمرأة'
    ],
    equipmentFr: [
      'Kits stériles à usage unique pour insertion et retrait d’implants contraceptifs',
      'Matériel d’anesthésie locale fine pour une procédure totalement indolore',
      'Table d’examen gynécologique capitonnée avec étriers confortables',
      'Sondes d’échographie obstétricale et pelvienne haute définition'
    ],
    equipmentAr: [
      'حقائب طبية معقمة أحادية الاستعمال لتركيب واستخراج كبسولات منع الحمل',
      'أدوات تخدير موضعي خفيف لجعل عملية التركيب خالية تماماً من الألم',
      'سرير فحص نسائي مريح ومجهز بأعلى معايير التعقيم والخصوصية',
      'مجسات فحص بالصدى عالية الدقة لمتابعة الحمل والرحم'
    ],
    preparationFr: [
      'Pour la pose d’un implant : planifier la séance pendant les 5 premiers jours du cycle menstruel (règles)',
      'Signaler au médecin tout antécédent de phlébite, hypertension ou allergie aux anesthésiques locaux',
      'Venir détendue : l’intervention dure moins de 5 minutes sous simple anesthésie locale'
    ],
    preparationAr: [
      'لتركيب كبسولة منع الحمل : يُفضل تحديد الموعد خلال الأيام الخمسة الأولى من الدورة الشهرية',
      'إخبار الطبيب بأي سوابق تخثر بالدم أو حساسية تجاه أدوية التخدير الموضعي',
      'القدوم باطمئنان تام : العملية بسيطة وتستغرق أقل من 5 دقائق بدون أي ألم'
    ],
    procedureFr: [
      'Consultation préalable et choix éclairé de la méthode contraceptive avec la patiente',
      'Désinfection cutanée et injection d’une micro-goutte d’anesthésiant local sous le bras',
      'Insertion douce de l’implant à l’aide d’un applicateur stérile sous la peau de la face interne du bras',
      'Pose d’un pansement compressif propre à conserver 24 à 48 heures',
      'Délivrance de la carte de suivi contraceptif avec date de renouvellement'
    ],
    procedureAr: [
      'استشارة طبية أولية ومناقشة الخيارات المناسبة باختيار واقتناع المريضة',
      'تعقيم الجلد وتطبيق تخدير موضعي خفيف غير مؤلم على الذراع من الداخل',
      'إدخال الكبسولة برفق بواسطة جهاز طبي معقم تحت الجلد مباشرة',
      'وضع ضمادة طبية خفيفة للحماية لمدة يوم إلى يومين',
      'تسليم بطاقة المتابعة الطبية متضمنة تاريخ الصلاحية وموعد التجديد'
    ],
    faqs: [
      {
        qFr: 'La pose d’un implant contraceptif fait-elle mal ?',
        qAr: 'هل يسبب تركيب كبسولة منع الحمل أي ألم ؟',
        aFr: 'Non, grâce à une anesthésie locale très douce, la pose est quasi-indolore et ne dure que 2 à 3 minutes.',
        aAr: 'لا، بفضل التخدير الموضعي البسيط، العملية غير مؤلمة بتاتاً ولا تتجاوز دقيقتين إلى ثلاث دقائق.'
      },
      {
        qFr: 'Combien de temps l’implant reste-t-il efficace ?',
        qAr: 'كم تدوم فعالية كبسولة منع الحمل ؟',
        aFr: 'L’implant contraceptif offre une protection continue d’une efficacité supérieure à 99% pendant 3 années consécutives, et peut être retiré à tout moment.',
        aAr: 'توفر الكبسولة حماية متواصلة بنسبة تفوق 99% لمدة 3 سنوات متتالية، ويمكن إزالتها في أي وقت عند الرغبة في الإنجاب.'
      }
    ]
  },
  {
    id: 'drainage',
    titleFr: 'Drainage Lymphatique Médical & Rééducation',
    titleAr: 'التصريف اللمفاوي الطبي والعلاج الفيزيائي',
    shortDescFr: 'Techniques manuelles médicales douces et certifiées pour stimuler la circulation lymphatique, résorber les œdèmes des membres et accélérer la récupération.',
    shortDescAr: 'تقنيات يدوية طبية معتمدة لتحفيز الدورة اللمفاوية، تخفيف تورم وانتفاخ الأطراف وتنشيط الدورة الدموية وسرعة التعافي.',
    fullDescFr: `Titulaire d'une formation spécialisée en drainage lymphatique manuel et en rééducation thérapeutique à Rabat, le Dr. NAMBOY Evrard Simplice propose des séances de drainage médical conformes aux protocoles scientifiques les plus stricts.

Le drainage lymphatique est une méthode manuelle douce, rythmée et indolore qui stimule les vaisseaux lymphatiques et favorise l'évacuation des liquides interstitiels excédentaires. Il est particulièrement recommandé après une chirurgie, en cas d'insuffisance veineuse chronique ou de lymphœdème.`,
    fullDescAr: `بفضل تكوين متخصص وشواهد معتمدة بالرباط في التصريف اللمفاوي اليدوي والعلاج الطبيعي، يقدم الدكتور نامبوي إيفرارد سيمبليس جلسات علاجية مدروسة تطبق أدق البرتوكولات العلمية.

التصريف اللمفاوي الطبي هو تقنية يدوية لطيفة، إيقاعية وغير مؤلمة تعمل على تنشيط الأوعية اللمفاوية وتصريف السوائل الزائدة المتراكمة في الأنسجة. يُنصح به بصفة خاصة بعد العمليات الجراحية، ولحالات انتفاخ وتورم الساقين والقصور الوريدي.`,
    image: '/images/Drainage-Lymphatique.jpg',
    iconName: 'Sparkles',
    badgeFr: 'Protocole Thérapeutique',
    badgeAr: 'بروتوكول علاجي',
    is24h: false,
    indicationsFr: [
      'Œdèmes des membres inférieurs, chevilles enflées et sensation de jambes lourdes',
      'Lymphœdèmes congénitaux ou secondaires à une intervention chirurgicale',
      'Récupération post-opératoire (chirurgie plastique, traumatologique ou abdominale)',
      'Troubles circulatoires veineux et rétention d’eau chronique',
      'Hématomes volumineux et engorgement tissulaire consécutif à un traumatisme',
      'Amélioration du bien-être global et élimination des toxines'
    ],
    indicationsAr: [
      'انتفاخ وتورم الساقين والكاحلين والإحساس المزمن بثقل الأطراف',
      'الوذمة اللمفاوية الناتجة عن ركود السوائل أو العمليات الجراحية',
      'تسريع الشفاء والتعافي بعد العمليات الجراحية والتجميلية',
      'اضطرابات الدورة الدموية الوريدية واحتباس السوائل المزمن',
      'تخفيف الكدمات والتجمعات الدموية بعد الصدمات والإصابات',
      'تعزيز الإحساس بالراحة والنشاط وتخليص الجسم من السموم'
    ],
    equipmentFr: [
      'Table de kinésithérapie et de massage médical ergonomique capitonnée',
      'Coussins anatomiques de décharge et de surélévation des membres',
      'Draps d’examen et linges hypoallergéniques stériles à usage individuel',
      'Huiles neutres certifiées hypoallergéniques de qualité pharmaceutique'
    ],
    equipmentAr: [
      'طاولة علاج طبيعي ومساج طبي مريحة ومعدّة خصيصاً للجلسات',
      'وسائد طبية لرفع الأطراف وتحسين سريان الدورة الدموية',
      'أغطية ومناشف معقمة ومريحة للاستخدام الفردي',
      'زيوت تدليك طبية معتمدة ومضادة للحساسية ذات جودة صيدلانية'
    ],
    preparationFr: [
      'Porter des vêtements amples et confortables faciles à ôter au niveau de la zone traitée',
      'Bien s’hydrater en buvant de l’eau avant et après la séance pour favoriser l’élimination rénale',
      'Éviter les repas lourds juste avant votre séance de drainage'
    ],
    preparationAr: [
      'ارتداء ملابس مريحة وفضفاضة يسهل خلعها عند موضع العلاج',
      'شرب كمية كافية من الماء قبل وبعد الجلسة لمساعدة الكلى على تصريف السوائل',
      'تجنب تناول وجبات دسمة قبل موعد الجلسة مباشرة'
    ],
    procedureFr: [
      'Bilan clinique préalable : mesure circonférentielle des membres et évaluation de l’œdème',
      'Installation du patient en position de décharge veineuse optimale',
      'Manœuvres manuelles douces et circulaires rythmées le long des trajets ganglionnaires',
      'Pression douce et progressive orientée vers les relais lymphatiques principaux',
      'Conseils de postures de repos et prescription éventuelle de bas de contention adaptés'
    ],
    procedureAr: [
      'فحص سريري أولي وقياس محيط الأطراف لتقييم درجة الانتفاخ بدقة',
      'استلقاء المريض في وضعية مريحة ترفع الأطراف لتحفيز الجريان الطبيعي',
      'حركات يدوية دائرية وإيقاعية لطيفة ومحسوبة على مسار الغدد اللمفاوية',
      'ضغط تدريجي خفيف يوجه السوائل نحو القنوات الرئيسية للجسم',
      'تقديم نصائح لتثبيت النتائج مع وصف الجوارب الضاغطة عند الضرورة'
    ],
    faqs: [
      {
        qFr: 'Le drainage lymphatique médical est-il douloureux ?',
        qAr: 'هل يسبب التصريف اللمفاوي الطبي أي ألم ؟',
        aFr: 'Pas du tout. C’est une technique extrêmement douce, relaxante et indolore. De nombreux patients ressentent un soulagement immédiat dès la première séance.',
        aAr: 'أبداً، التقنية هادئة ولطيفة جداً وغير مؤلمة بالمرة، بل تمنح إحساساً فورياً بالخفة والراحة ابتداءً من الجلسة الأولى.'
      }
    ]
  },
  {
    id: 'driving',
    titleFr: 'Aptitude Médicale Permis de Conduire',
    titleAr: 'الفحص الطبي لأهلية رخصة السياقة',
    shortDescFr: 'Visite médicale officielle d’aptitude à la conduite (acuité visuelle, champ visuel, réflexes, tension artérielle) avec certificat médical homologué délivré immédiatement.',
    shortDescAr: 'فحص طبي رسمي للقدرة على السياقة (فحص حدة البصر، مجال الرؤية، ردود الأفعال، الضغط الدموي) مع تسليم الشهادة المعتمدة فوراً.',
    fullDescFr: `Le Cabinet Médical du Dr. NAMBOY Evrard Simplice à Salé Bettana est habilité à réaliser les examens médicaux réglementaires d'aptitude physique et sensorielle à la conduite automobile.

Que ce soit pour une première obtention (permis A, B) ou pour un renouvellement périodique obligatoire (permis poids lourds C, D, transport en commun, chauffeurs de taxi ou conducteurs seniors), le Dr. NAMBOY effectue un contrôle rigoureux de l'acuité visuelle, de la perception des couleurs, du champ visuel, de la motricité et de la santé cardiovasculaire, et vous délivre sur-le-champ le certificat conforme à la réglementation marocaine.`,
    fullDescAr: `العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس بسلا بطانة معتمدة ومؤهلة لإجراء الفحوصات الطبية النظامية للتأكد من الأهلية البدنية والحركية والبصرية لسياقة السيارات والمركبات.

سواء كان ذلك للحصول على رخصة السياقة لأول مرة (الأصناف A و B) أو التجديد الدوري الإلزامي (الشاحنات والحافلات C و D، سيارات الأجرة أو السائقين كبار السن)، يجري الدكتور نامبوي فحصاً دقيقاً لحدة البصر، تمييز الألوان، سلامة القلب والضغط، ويسلمكم فوراً الشهادة الطبية الرسمية المطابقة للضوابط القانونية بالمملكة.`,
    image: '/images/Aptitude-Médicale.jpg',
    iconName: 'Car',
    badgeFr: 'Certificat Homologué',
    badgeAr: 'شهادة رسمية معتمدة',
    is24h: false,
    indicationsFr: [
      'Visite médicale pour première obtention du permis de conduire catégorie B (voitures légères) et A (motos)',
      'Visite médicale périodique obligatoire pour permis professionnels C, D, E (poids lourds, autocars)',
      'Renouvellement décennal du permis de conduire pour conducteurs particuliers',
      'Visite médicale d’aptitude pour chauffeurs de taxi, VTC et transport de personnes',
      'Contrôle médical après suspension, invalidation ou à la suite d’un problème de santé majeur'
    ],
    indicationsAr: [
      'الفحص الطبي لاجتياز رخصة السياقة صنف B (السيارات الخفيفة) وصنف A (الدراجات النارية)',
      'الفحص الطبي الدوري الإلزامي لأصناف الشاحنات والحافلات C و D و E',
      'تجديد رخصة السياقة كل 10 سنوات لكافة السائقين',
      'الفحص الطبي المهني لسائقي سيارات الأجرة والنقل الطرقي',
      'فحص اللياقة الصحية بعد التوقف عن السياقة أو إثر عارض صحي'
    ],
    equipmentFr: [
      'Échelle optométrique murale lumineuse standardisée (Snellen / Monoyer) avec mire d’acuité visuelle',
      'Tests de perception des contrastes et de vision chromatique (planches pseudo-isochromatiques d’Ishihara)',
      'Tensiomètres et stéthoscopes de haute précision pour contrôle cardiovasculaire',
      'Marteau à réflexes et matériel de test de coordination motrice et temporelle'
    ],
    equipmentAr: [
      'لوحة فحص حدة البصر الجدارية المضيئة المعتمدة (Snellen / Monoyer)',
      'اختبارات الكشف عن عمى الألوان وتمييز الإشارات المرورية (ألواح إيشيهارا)',
      'أجهزة قياس الضغط ونبض القلب لتقييم صحة الجهاز القلبي الوعائي',
      'أدوات فحص ردود الأفعال العصبية والتوافق الحركي البصري'
    ],
    preparationFr: [
      'Apporter votre Carte d’Identité Nationale (CIN) en cours de validité',
      'Si vous portez des lunettes de vue ou lentilles de contact, amenez-les impérativement le jour de la visite',
      'Se munir des formulaires officiels fournis par l’auto-école ou téléchargeables auprès de l’Agence Nationale de la Sécurité Routière (NARSA)',
      'Deux photos d’identité récentes aux normes officielles'
    ],
    preparationAr: [
      'إحضار أصل البطاقة الوطنية للتعريف الإلكترونية (CIN) سارية المفعول',
      'في حال استعمال نظارات طبية أو عدسات لاصقة، يجب إحضارها يوم الفحص',
      'إحضار مطبوع الفحص الطبي المسلم من مدرسة تعليم السياقة أو الوكالة الوطنية للسلامة الطرقية (NARSA)',
      'صورتان شمسيتان حديثتان للسائق'
    ],
    procedureFr: [
      'Vérification de l’identité du candidat et enregistrement du dossier',
      'Test d’acuité visuelle de loin, de près et test de vision des couleurs (feux de signalisation)',
      'Examen cardiovasculaire complet : auscultation cardiaque, prise de tension artérielle, dépistage de l’arythmie',
      'Test des réflexes ostéo-tendineux et de la mobilité articulaire des membres supérieurs et inférieurs',
      'Renseignement, signature et apposition du cachet officiel sur le certificat médical conforme'
    ],
    procedureAr: [
      'التأكد من هوية المترشح وتسجيل البيانات الرسمية',
      'فحص حدة البصر عن بعد وعن قرب واختبار تمييز ألوان إشارات المرور',
      'فحص قلبي وعائي شامل : قياس ضغط الدم والتأكد من سلامة ضربات القلب',
      'فحص ردود الفعل الحركية والعصبية ومرونة الأطراف والرقبة',
      'ملء وتوقيع الشهادة الطبية الرسمية مع وضع الخاتم المهني المعتمد في الحين'
    ],
    faqs: [
      {
        qFr: 'Le certificat médical est-il délivré immédiatement après la visite ?',
        qAr: 'هل تُسلم الشهادة الطبية فور انتهاء الفحص ؟',
        aFr: 'Oui, si l’examen est concluant, le Dr. NAMBOY vous remet votre certificat médical officiel signé et cacheté sur-le-champ pour votre dossier NARSA ou auto-école.',
        aAr: 'نعم، في حال كانت نتائج الفحص سليمة، يسلمكم الدكتور نامبوي الشهادة الطبية الرسمية موقعة ومختومة في نفس اللحظة.'
      },
      {
        qFr: 'Puis-je passer la visite si je porte des lunettes de vue ?',
        qAr: 'هل يمكنني اجتياز الفحص الطبي وأنا أرتدي نظارات لتصحيح النظر ؟',
        aFr: 'Absolument. Le test mesure votre acuité visuelle avec votre correction optique (lunettes ou lentilles), et la mention "port de verres correcteurs obligatoire" sera simplement stipulée sur le certificat conformément au code de la route.',
        aAr: 'بالتأكيد. يُجرى الفحص مع النظارات الطبية، ويتم تدوين ملاحظة "ارتداء نظارات إلزامي أثناء السياقة" وفقاً لمقتضيات قانون السير.'
      }
    ]
  },
  {
    id: 'evacuation',
    titleFr: 'Accompagnement & Évacuations Sanitaires (Ambulance & Avion)',
    titleAr: 'المرافقة الطبية والإجلاء الصحي (سيارة إسعاف وطائرة)',
    shortDescFr: 'Transferts médicalisés par ambulance et par avion, avec accompagnement du patient par du personnel soignant du départ jusqu’à l’arrivée.',
    shortDescAr: 'نقل طبي مجهز بسيارة الإسعاف أو بالطائرة، مع مرافقة المريض من طرف طاقم صحي من نقطة الانطلاق إلى الوصول.',
    fullDescFr: `Lorsque l'état d'un patient nécessite une prise en charge dans une structure hospitalière plus adaptée, ou un retour dans son pays d'origine, un transfert sécurisé devient indispensable. Le Cabinet du Dr. NAMBOY Evrard Simplice organise et accompagne les évacuations sanitaires, par voie terrestre (ambulance médicalisée) ou aérienne (vol commercial avec accompagnement médical ou avion sanitaire).

Chaque évacuation est préparée en amont : évaluation de l'état clinique, choix du moyen de transport le plus adapté, coordination avec la structure d'accueil et remise d'un dossier médical complet. Le patient est surveillé et rassuré tout au long du trajet.`,
    fullDescAr: `عندما تستدعي حالة المريض نقله إلى مؤسسة استشفائية أنسب أو إلى بلده الأصلي، يصبح النقل الآمن ضرورة. تنظم العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس عمليات الإجلاء الصحي وترافقها، برياً عبر سيارة إسعاف مجهزة أو جواً عبر رحلة تجارية بمرافقة طبية أو طائرة إسعاف.

يتم تحضير كل عملية إجلاء مسبقاً: تقييم الحالة السريرية، اختيار وسيلة النقل الأنسب، التنسيق مع المؤسسة المستقبِلة وتسليم ملف طبي كامل. ويظل المريض تحت المراقبة والطمأنة طيلة الرحلة.`,
    image: '/images/Accompagnement & Évacuations Sanitaires (Ambulance & Avion).jpg',
    iconName: 'Ambulance',
    badgeFr: 'Ambulance & Avion',
    badgeAr: 'إسعاف وطائرة',
    is24h: false,
    indicationsFr: [
      'Transfert médicalisé en ambulance vers un hôpital ou une clinique spécialisée',
      'Évacuation sanitaire par avion (vol commercial médicalisé ou avion sanitaire)',
      'Rapatriement de patients vers leur pays d’origine après stabilisation',
      'Accompagnement de patients fragiles, âgés ou à mobilité réduite lors d’un voyage',
      'Transfert inter-hospitalier nécessitant une surveillance continue'
    ],
    indicationsAr: [
      'نقل طبي بسيارة إسعاف نحو مستشفى أو مصحة متخصصة',
      'الإجلاء الصحي جواً (رحلة تجارية بمرافقة طبية أو طائرة إسعاف)',
      'إعادة المرضى إلى بلدهم الأصلي بعد استقرار حالتهم',
      'مرافقة المرضى الهشين أو كبار السن أو ذوي الحركة المحدودة أثناء السفر',
      'النقل بين المستشفيات للحالات التي تتطلب مراقبة مستمرة'
    ],
    equipmentFr: [
      'Ambulance équipée : oxygène, brancard, aspirateur de mucosités, monitoring',
      'Matériel de perfusion et médicaments d’urgence embarqués',
      'Oxygène portable et dispositifs de surveillance adaptés au voyage aérien',
      'Dossier médical de transfert complet (comptes rendus, imageries, traitements)'
    ],
    equipmentAr: [
      'سيارة إسعاف مجهزة: أكسجين، نقالة، جهاز شفط الإفرازات وأجهزة مراقبة',
      'معدات المحاليل الوريدية والأدوية المستعجلة على متن الوسيلة',
      'أكسجين محمول وأجهزة مراقبة ملائمة للسفر الجوي',
      'ملف طبي كامل للنقل (تقارير، صور الأشعة، العلاجات)'
    ],
    preparationFr: [
      'Contacter le cabinet le plus tôt possible pour une évaluation de la situation',
      'Préparer passeport ou CIN, assurance ou assistance et derniers examens médicaux',
      'Communiquer la destination, la date souhaitée et les coordonnées de la structure d’accueil',
      'Informer l’équipe de tout traitement en cours et de toute allergie connue'
    ],
    preparationAr: [
      'الاتصال بالعيادة في أقرب وقت لتقييم الوضعية',
      'تحضير جواز السفر أو البطاقة الوطنية، التأمين أو شركة المساعدة وآخر الفحوصات',
      'تحديد الوجهة والتاريخ المرغوب وبيانات المؤسسة المستقبِلة',
      'إخبار الفريق بأي علاج جارٍ وبأي حساسية معروفة'
    ],
    procedureFr: [
      'Évaluation clinique et validation de l’aptitude au transport',
      'Choix du mode de transfert (ambulance, vol commercial médicalisé, avion sanitaire)',
      'Coordination avec la structure d’accueil et transmission du dossier médical',
      'Transfert avec accompagnement et surveillance des constantes pendant le trajet',
      'Remise du patient à l’équipe d’accueil et compte rendu de transmission'
    ],
    procedureAr: [
      'تقييم سريري والتأكد من قدرة المريض على تحمل النقل',
      'اختيار وسيلة النقل (سيارة إسعاف، رحلة تجارية بمرافقة طبية، طائرة إسعاف)',
      'التنسيق مع المؤسسة المستقبِلة وإرسال الملف الطبي',
      'تنفيذ النقل مع المرافقة ومراقبة المؤشرات الحيوية طيلة الرحلة',
      'تسليم المريض لفريق الاستقبال مع تقرير التسليم'
    ],
    faqs: [
      {
        qFr: 'Peut-on organiser une évacuation en avion ?',
        qAr: 'هل يمكن تنظيم إجلاء جوي ؟',
        aFr: 'Oui. Selon l’état du patient, l’évacuation peut se faire par vol commercial avec accompagnement médical ou par avion sanitaire. Le choix est validé après évaluation clinique.',
        aAr: 'نعم. حسب حالة المريض، يمكن أن يتم الإجلاء عبر رحلة تجارية بمرافقة طبية أو بطائرة إسعاف، ويُحدد الاختيار بعد التقييم السريري.'
      },
      {
        qFr: 'Un soignant accompagne-t-il le patient pendant le trajet ?',
        qAr: 'هل يرافق المريض طاقم صحي خلال الرحلة ؟',
        aFr: 'Oui, l’accompagnement par du personnel soignant est prévu pour assurer la surveillance et le confort du patient. Contactez-nous pour un devis adapté à votre situation.',
        aAr: 'نعم، تتم المرافقة من طرف طاقم صحي لضمان مراقبة المريض وراحته. تواصلوا معنا للحصول على عرض ملائم لحالتكم.'
      }
    ]
  },
  {
    id: 'teleconsultation',
    titleFr: 'Téléconsultations & Suivi à Distance',
    titleAr: 'الاستشارات الطبية عن بعد والمتابعة',
    shortDescFr: 'Consultez le Dr. NAMBOY en visioconférence, où que vous soyez : avis médical, renouvellement de suivi, lecture de résultats et accompagnement des patients à distance.',
    shortDescAr: 'استشيروا الدكتور نامبوي عبر المكالمة المرئية أينما كنتم: رأي طبي، متابعة العلاج، قراءة النتائج ومواكبة المرضى عن بعد.',
    fullDescFr: `La téléconsultation permet de bénéficier de l'expertise du Dr. NAMBOY Evrard Simplice sans vous déplacer. Elle s'adresse aux patients éloignés, aux personnes à mobilité réduite, aux voyageurs et à la diaspora, ainsi qu'aux familles souhaitant un second avis rapide.

Au-delà de la première consultation, le suivi à distance garantit la continuité des soins : contrôle de l'évolution des symptômes, ajustement du traitement, interprétation de résultats d'analyses ou d'imagerie et conseils personnalisés. Les échanges restent strictement confidentiels.`,
    fullDescAr: `تتيح الاستشارة عن بعد الاستفادة من خبرة الدكتور نامبوي إيفرارد سيمبليس دون التنقل. وهي موجهة للمرضى البعيدين، والأشخاص ذوي الحركة المحدودة، والمسافرين والجالية، وكذا للأسر الراغبة في رأي طبي ثانٍ بسرعة.

بعد الاستشارة الأولى، تضمن المتابعة عن بعد استمرارية الرعاية: مراقبة تطور الأعراض، تعديل العلاج، تفسير نتائج التحاليل والأشعة وتقديم نصائح شخصية. وتبقى جميع المبادلات سرية تماماً.`,
    image: '/images/Téléconsultations & Suivi à Distance.webp',
    iconName: 'Video',
    badgeFr: 'Consultation en ligne',
    badgeAr: 'استشارة عن بعد',
    is24h: false,
    indicationsFr: [
      'Avis médical rapide pour un symptôme ou une inquiétude de santé',
      'Suivi à distance des maladies chroniques (diabète, hypertension, asthme)',
      'Lecture et explication de résultats d’analyses, d’échographies ou de radiographies',
      'Consultation des patients éloignés, voyageurs et membres de la diaspora',
      'Second avis médical et orientation vers la prise en charge adaptée'
    ],
    indicationsAr: [
      'رأي طبي سريع بخصوص عرَض أو قلق صحي',
      'متابعة الأمراض المزمنة عن بعد (السكري، ضغط الدم، الربو)',
      'قراءة وشرح نتائج التحاليل والفحص بالصدى والأشعة',
      'استشارة المرضى البعيدين والمسافرين وأفراد الجالية',
      'رأي طبي ثانٍ وتوجيه نحو الرعاية المناسبة'
    ],
    equipmentFr: [
      'Plateforme de visioconférence sécurisée et confidentielle',
      'Dossier médical informatisé accessible pour le suivi',
      'Possibilité de partage de documents (analyses, imageries, ordonnances)',
      'Connexion stable et poste de consultation dédié'
    ],
    equipmentAr: [
      'منصة مكالمات مرئية آمنة وسرية',
      'ملف طبي إلكتروني متاح للمتابعة',
      'إمكانية تبادل الوثائق (تحاليل، صور الأشعة، وصفات)',
      'اتصال مستقر ومكتب استشارة مخصص'
    ],
    preparationFr: [
      'Disposer d’un smartphone, tablette ou ordinateur avec caméra et micro',
      'Choisir un endroit calme et bien éclairé avec une bonne connexion internet',
      'Préparer vos documents médicaux (analyses, imageries, ordonnances) en photo ou PDF',
      'Noter vos symptômes, leur durée et vos questions avant la séance'
    ],
    preparationAr: [
      'توفير هاتف ذكي أو لوح أو حاسوب مزود بكاميرا وميكروفون',
      'اختيار مكان هادئ وجيد الإضاءة مع اتصال إنترنت جيد',
      'تحضير وثائقكم الطبية (تحاليل، أشعة، وصفات) على شكل صور أو PDF',
      'تدوين الأعراض ومدتها وأسئلتكم قبل الجلسة'
    ],
    procedureFr: [
      'Prise de rendez-vous et réception du lien de connexion sécurisé',
      'Entretien en visio : histoire de la maladie, antécédents, traitements en cours',
      'Examen visuel guidé et analyse des documents transmis',
      'Conseils, prescription ou orientation vers une consultation en présentiel si nécessaire',
      'Planification du suivi à distance et des prochains contrôles'
    ],
    procedureAr: [
      'حجز موعد وتوصل برابط الاتصال الآمن',
      'حوار عبر الفيديو: تاريخ المرض، السوابق، العلاجات الجارية',
      'فحص بصري موجَّه وتحليل الوثائق المرسلة',
      'نصائح، وصفة طبية أو توجيه نحو استشارة حضورية عند الحاجة',
      'برمجة المتابعة عن بعد والمراقبات المقبلة'
    ],
    faqs: [
      {
        qFr: 'La téléconsultation remplace-t-elle une consultation au cabinet ?',
        qAr: 'هل تغني الاستشارة عن بعد عن الفحص في العيادة ؟',
        aFr: 'Elle convient à de nombreuses situations (suivi, avis, résultats). Si un examen physique est indispensable, le médecin vous orientera vers une consultation en présentiel.',
        aAr: 'تناسب حالات كثيرة (متابعة، رأي، نتائج). وإذا كان الفحص السريري ضرورياً، سيوجهكم الطبيب نحو استشارة حضورية.'
      },
      {
        qFr: 'Mes données médicales sont-elles confidentielles ?',
        qAr: 'هل بياناتي الطبية سرية ؟',
        aFr: 'Oui. Les échanges et documents partagés sont traités dans le strict respect du secret médical.',
        aAr: 'نعم. تُعالج المبادلات والوثائق المشاركة في احترام تام للسر الطبي.'
      }
    ]
  },
  {
    id: 'homecare',
    titleFr: 'Soins à Domicile',
    titleAr: 'العلاج والرعاية الصحية بالمنزل',
    shortDescFr: 'Soins, traitements et suivi médical de vos proches directement chez vous : injections, perfusions, pansements, surveillance et accompagnement des patients alités.',
    shortDescAr: 'علاج ومتابعة طبية لأقاربكم في المنزل مباشرة: حقن، محاليل، ضمادات، مراقبة ومواكبة المرضى طريحي الفراش.',
    fullDescFr: `Se déplacer peut être difficile, voire impossible, pour les personnes âgées, les patients alités, les convalescents ou les jeunes enfants. Le service de soins à domicile apporte l'équipe médicale au chevet du patient, dans le confort et la sécurité de son foyer.

Le médecin et l'équipe soignante assurent l'évaluation clinique, l'administration des traitements et la surveillance régulière, en lien avec le dossier médical du cabinet. L'objectif : un soin de qualité, humain, et une récupération plus sereine entourée des proches.`,
    fullDescAr: `قد يصعب التنقل أو يستحيل على كبار السن والمرضى طريحي الفراش والنقاهة والأطفال الصغار. تأتي خدمة العلاج بالمنزل بالفريق الطبي إلى جانب المريض، في راحة وأمان بيته.

يتولى الطبيب والطاقم الصحي التقييم السريري وإعطاء العلاجات والمراقبة المنتظمة، بالارتباط مع الملف الطبي للعيادة. الهدف: رعاية جيدة وإنسانية وتعافٍ أكثر طمأنينة بين الأهل.`,
    image: '/images/Soins à Domicile.jpg',
    iconName: 'Home',
    badgeFr: 'Au chevet du patient',
    badgeAr: 'بجانب المريض',
    is24h: false,
    indicationsFr: [
      'Consultation médicale à domicile pour patients âgés, alités ou à mobilité réduite',
      'Injections, perfusions et administration de traitements prescrits',
      'Soins de plaies, pansements et surveillance post-opératoire',
      'Surveillance des constantes (tension, glycémie, saturation en oxygène)',
      'Suivi des maladies chroniques et des patients en convalescence',
      'Soins et surveillance du nourrisson et du jeune enfant fiévreux'
    ],
    indicationsAr: [
      'استشارة طبية بالمنزل للمرضى كبار السن أو طريحي الفراش أو ذوي الحركة المحدودة',
      'الحقن والمحاليل الوريدية وإعطاء العلاجات الموصوفة',
      'العناية بالجروح والضمادات والمراقبة بعد العمليات الجراحية',
      'مراقبة المؤشرات (الضغط، السكر، نسبة الأكسجين)',
      'متابعة الأمراض المزمنة والمرضى في فترة النقاهة',
      'رعاية ومراقبة الرضيع والطفل الصغير المصاب بالحمى'
    ],
    equipmentFr: [
      'Mallette médicale mobile : tensiomètre, oxymètre, thermomètre, lecteur de glycémie',
      'Matériel stérile à usage unique pour injections, perfusions et pansements',
      'Médicaments et solutés de première nécessité',
      'Carnet de suivi à domicile transmis au dossier médical du cabinet'
    ],
    equipmentAr: [
      'حقيبة طبية متنقلة: جهاز الضغط، قياس الأكسجين، ميزان الحرارة، جهاز قياس السكر',
      'معدات معقمة أحادية الاستعمال للحقن والمحاليل والضمادات',
      'أدوية ومحاليل أساسية',
      'دفتر متابعة منزلية يُدمج في الملف الطبي للعيادة'
    ],
    preparationFr: [
      'Préparer l’ordonnance en cours, la liste des médicaments et les derniers examens',
      'Prévoir un espace propre, bien éclairé et accessible près du patient',
      'Communiquer l’adresse exacte et un numéro de contact joignable',
      'Préciser le motif de la visite et les symptômes observés'
    ],
    preparationAr: [
      'تحضير الوصفة الحالية وقائمة الأدوية وآخر الفحوصات',
      'توفير مكان نظيف وجيد الإضاءة وسهل الولوج قرب المريض',
      'تقديم العنوان الدقيق ورقم هاتف للتواصل',
      'توضيح سبب الزيارة والأعراض الملاحظة'
    ],
    procedureFr: [
      'Prise de contact et évaluation de la demande par téléphone',
      'Déplacement de l’équipe médicale au domicile du patient',
      'Examen clinique et contrôle des constantes vitales',
      'Réalisation des soins prescrits (injection, perfusion, pansement)',
      'Explications à la famille, ordonnance et planification des prochaines visites'
    ],
    procedureAr: [
      'التواصل الهاتفي وتقييم الطلب',
      'تنقل الفريق الطبي إلى منزل المريض',
      'فحص سريري ومراقبة المؤشرات الحيوية',
      'إجراء العلاجات الموصوفة (حقن، محاليل، ضمادات)',
      'شرح للأسرة، وصفة طبية وبرمجة الزيارات القادمة'
    ],
    faqs: [
      {
        qFr: 'Quels soins peuvent être réalisés à domicile ?',
        qAr: 'ما هي العلاجات التي يمكن إجراؤها بالمنزل ؟',
        aFr: 'Consultations, injections, perfusions, pansements, surveillance des constantes et suivi des patients chroniques ou convalescents. Si l’état du patient l’exige, un transfert vers le cabinet ou l’hôpital est organisé.',
        aAr: 'استشارات، حقن، محاليل، ضمادات، مراقبة المؤشرات ومتابعة المرضى المزمنين أو في النقاهة. وإذا استدعت الحالة ذلك، يتم تنظيم نقل نحو العيادة أو المستشفى.'
      },
      {
        qFr: 'Comment demander une visite à domicile ?',
        qAr: 'كيف أطلب زيارة طبية للمنزل ؟',
        aFr: 'Appelez-nous au +212 7 70 55 82 99 ou utilisez le bouton de rendez-vous du site en indiquant votre adresse.',
        aAr: 'اتصلوا بنا على 212770558299+ أو استعملوا زر حجز الموعد في الموقع مع ذكر العنوان.'
      }
    ]
  },
  {
    id: 'evacuation-maroc',
    titleFr: 'Évacuations vers le Maroc & Démarches Administratives',
    titleAr: 'الإجلاء نحو المغرب والإجراءات الإدارية',
    shortDescFr: 'Suivi médical et prise en charge de l’ensemble de vos démarches administratives d’évacuation vers le Maroc, de la décision médicale à l’admission du patient.',
    shortDescAr: 'متابعة طبية وتكفل بجميع الإجراءات الإدارية المتعلقة بالإجلاء نحو المغرب، من القرار الطبي إلى استقبال المريض.',
    fullDescFr: `Faire évacuer un proche malade vers le Maroc est une épreuve, aggravée par la complexité des démarches. Le Cabinet du Dr. NAMBOY Evrard Simplice vous accompagne de bout en bout : suivi médical du patient et prise en charge de l'ensemble des formalités administratives liées à l'évacuation.

Dossier médical, coordination avec l'établissement d'accueil au Maroc, documents de voyage, échanges avec les assurances ou sociétés d'assistance et organisation du transport (ambulance, avion) : vous n'avez plus qu'à vous concentrer sur la santé du patient, nous gérons le reste avec rigueur et transparence.`,
    fullDescAr: `إجلاء قريب مريض نحو المغرب تجربة صعبة، تزيدها تعقيداً الإجراءات الإدارية. ترافقكم العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس في جميع المراحل: المتابعة الطبية للمريض والتكفل بكافة الإجراءات الإدارية المرتبطة بالإجلاء.

الملف الطبي، التنسيق مع المؤسسة المستقبِلة بالمغرب، وثائق السفر، التواصل مع شركات التأمين أو المساعدة وتنظيم النقل (سيارة إسعاف، طائرة): ما عليكم سوى التركيز على صحة المريض، ونحن نتكفل بالباقي بدقة وشفافية.`,
    image: '/images/Évacuations vers le Maroc & Démarches Administratives.jpg',
    iconName: 'Plane',
    badgeFr: 'Démarches clés en main',
    badgeAr: 'إجراءات متكاملة',
    is24h: false,
    indicationsFr: [
      'Évacuation d’un patient depuis l’étranger vers un hôpital ou une clinique au Maroc',
      'Constitution du dossier médical d’évacuation et rapports médicaux justificatifs',
      'Démarches auprès des assurances, mutuelles et sociétés d’assistance',
      'Coordination avec l’établissement d’accueil et organisation de l’admission',
      'Aide aux documents de voyage et formalités administratives du patient et de ses accompagnants'
    ],
    indicationsAr: [
      'إجلاء مريض من الخارج نحو مستشفى أو مصحة بالمغرب',
      'إعداد الملف الطبي للإجلاء والتقارير الطبية المبررة',
      'الإجراءات لدى شركات التأمين والتعاضديات وشركات المساعدة',
      'التنسيق مع المؤسسة المستقبِلة وتنظيم الاستقبال',
      'المساعدة في وثائق السفر والإجراءات الإدارية للمريض ومرافقيه'
    ],
    equipmentFr: [
      'Dossier médical informatisé et sécurisé pour la constitution des rapports',
      'Réseau de coordination avec établissements de santé et transporteurs',
      'Moyens de transport médicalisé (ambulance, accompagnement aérien)',
      'Suivi centralisé du dossier avec point d’avancement régulier à la famille'
    ],
    equipmentAr: [
      'ملف طبي إلكتروني آمن لإعداد التقارير',
      'شبكة تنسيق مع المؤسسات الصحية وشركات النقل',
      'وسائل نقل طبي (سيارة إسعاف، مرافقة جوية)',
      'تتبع مركزي للملف مع إطلاع منتظم للأسرة على التقدم'
    ],
    preparationFr: [
      'Réunir passeport ou CIN du patient et les documents d’assurance ou d’assistance',
      'Rassembler comptes rendus, imageries, analyses et ordonnances disponibles',
      'Indiquer le lieu actuel du patient, la destination souhaitée au Maroc et l’urgence',
      'Désigner un contact familial joignable pour les échanges administratifs'
    ],
    preparationAr: [
      'جمع جواز السفر أو البطاقة الوطنية للمريض ووثائق التأمين أو المساعدة',
      'تجميع التقارير والأشعة والتحاليل والوصفات المتوفرة',
      'تحديد مكان وجود المريض حالياً والوجهة المرغوبة بالمغرب ودرجة الاستعجال',
      'تعيين شخص من الأسرة يمكن التواصل معه في الأمور الإدارية'
    ],
    procedureFr: [
      'Analyse de la situation médicale et administrative du patient',
      'Constitution du dossier médical et des justificatifs requis',
      'Coordination avec l’assurance ou l’assistance et avec l’établissement d’accueil au Maroc',
      'Organisation du transport (ambulance, avion) avec accompagnement si nécessaire',
      'Accueil au Maroc, suivi médical et information continue de la famille'
    ],
    procedureAr: [
      'دراسة الوضعية الطبية والإدارية للمريض',
      'إعداد الملف الطبي والوثائق المبررة المطلوبة',
      'التنسيق مع شركة التأمين أو المساعدة ومع المؤسسة المستقبِلة بالمغرب',
      'تنظيم النقل (سيارة إسعاف، طائرة) مع المرافقة عند الحاجة',
      'الاستقبال بالمغرب، المتابعة الطبية وإخبار الأسرة باستمرار'
    ],
    faqs: [
      {
        qFr: 'Prenez-vous en charge les démarches administratives ?',
        qAr: 'هل تتكفلون بالإجراءات الإدارية ؟',
        aFr: 'Oui, nous gérons l’ensemble du suivi administratif de l’évacuation : dossier médical, coordination avec l’établissement d’accueil, assurances et organisation du transport.',
        aAr: 'نعم، نتكفل بكامل المتابعة الإدارية للإجلاء: الملف الطبي، التنسيق مع المؤسسة المستقبِلة، شركات التأمين وتنظيم النقل.'
      },
      {
        qFr: 'Comment démarrer une demande d’évacuation vers le Maroc ?',
        qAr: 'كيف أبدأ طلب إجلاء نحو المغرب ؟',
        aFr: 'Contactez-nous au +212 7 70 55 82 99 avec les informations de base sur le patient. Nous évaluons la situation et vous indiquons les prochaines étapes.',
        aAr: 'اتصلوا بنا على 212770558299+ مع المعلومات الأساسية عن المريض، وسنقيّم الوضعية ونوضح لكم الخطوات المقبلة.'
      }
    ]
  },
  // ---------------------------------------------------------------------
  // NOUVEAUX SERVICES AJOUTÉS
  // ---------------------------------------------------------------------
  {
    id: 'certificat_aptitude',
    titleFr: "Certificat d'aptitude",
    titleAr: 'شهادة اللياقة الطبية',
    shortDescFr: "Délivrance d'un certificat d'aptitude médicale pour le travail, le sport ou d'autres activités.",
    shortDescAr: 'إصدار شهادة اللياقة الطبية للعمل أو الرياضة أو أنشطة أخرى.',
    fullDescFr: `Le certificat d'aptitude est un document médical attestant que le patient est apte à exercer une activité spécifique (travail, sport, etc.). Le Dr. NAMBOY réalise un examen clinique complet et délivre le certificat conformément à la réglementation.`,
    fullDescAr: `شهادة اللياقة الطبية هي وثيقة طبية تشهد بأن المريض لائق لمزاولة نشاط معين (عمل، رياضة، إلخ). يقوم الدكتور نامبوي بفحص سريري شامل ويسلم الشهادة وفقاً للتنظيمات.`,
    image: '/images/certificat-aptitude.jpeg',
    iconName: 'FileCheck',
    badgeFr: 'Certificat médical',
    badgeAr: 'شهادة طبية',
    is24h: false,
    indicationsFr: [
      "Certificat d'aptitude au travail",
      "Certificat d'aptitude sportive",
      "Certificat d'aptitude pour activités spécifiques"
    ],
    indicationsAr: [
      'شهادة اللياقة للعمل',
      'شهادة اللياقة الرياضية',
      'شهادة اللياقة لأنشطة معينة'
    ],
    equipmentFr: [
      'Tensiomètre',
      'Stéthoscope',
      "Matériel d'examen clinique"
    ],
    equipmentAr: [
      'جهاز قياس الضغط',
      'السماعة الطبية',
      'أدوات الفحص السريري'
    ],
    preparationFr: [
      "Apporter une pièce d'identité",
      'Se munir des formulaires requis si nécessaire'
    ],
    preparationAr: [
      'إحضار بطاقة التعريف',
      'إحضار الاستمارات المطلوبة إن وجدت'
    ],
    procedureFr: [
      'Examen clinique complet',
      'Vérification des antécédents médicaux',
      'Délivrance du certificat signé et cacheté'
    ],
    procedureAr: [
      'فحص سريري شامل',
      'التحقق من السوابق الطبية',
      'تسليم الشهادة موقعة ومختومة'
    ],
    faqs: [
      {
        qFr: 'Quels documents apporter ?',
        qAr: 'ما الوثائق المطلوبة؟',
        aFr: "Une pièce d'identité et les formulaires spécifiques si requis.",
        aAr: 'بطاقة التعريف والاستمارات الخاصة إن وجدت.'
      }
    ]
  },
  {
    id: 'certificat_absence_maladie_contagieuse',
    titleFr: "Certificat médical d'absence de maladie contagieuse pour la carte de séjour",
    titleAr: 'شهادة طبية بعدم وجود مرض معدٍ لبطاقة الإقامة',
    shortDescFr: "Examen médical et délivrance du certificat d'absence de maladie contagieuse requis pour la carte de séjour.",
    shortDescAr: 'فحص طبي وإصدار الشهادة الطبية بعدم وجود مرض معدٍ المطلوبة لبطاقة الإقامة.',
    fullDescFr: `Pour l'obtention ou le renouvellement de la carte de séjour, un certificat médical attestant l'absence de maladie contagieuse est souvent exigé. Le Dr. NAMBOY réalise les examens nécessaires et délivre le certificat conforme.`,
    fullDescAr: `للحصول على بطاقة الإقامة أو تجديدها، غالباً ما تُطلب شهادة طبية تشهد بعدم وجود مرض معدٍ. يقوم الدكتور نامبوي بالفحوصات اللازمة ويسلم الشهادة المطابقة.`,
    image: '/images/certificat-absence-maladie-contagieuse.jpg',
    iconName: 'ShieldCheck',
    badgeFr: 'Carte de séjour',
    badgeAr: 'بطاقة الإقامة',
    is24h: false,
    indicationsFr: [
      'Demande de carte de séjour',
      'Renouvellement de carte de séjour',
      'Autres démarches administratives exigeant ce certificat'
    ],
    indicationsAr: [
      'طلب بطاقة الإقامة',
      'تجديد بطاقة الإقامة',
      'إجراءات إدارية أخرى تتطلب هذه الشهادة'
    ],
    equipmentFr: [
      "Matériel d'examen clinique",
      'Tests de dépistage si nécessaire'
    ],
    equipmentAr: [
      'أدوات الفحص السريري',
      'اختبارات الكشف عند الحاجة'
    ],
    preparationFr: [
      "Apporter une pièce d'identité",
      'Se munir du formulaire administratif concerné'
    ],
    preparationAr: [
      'إحضار بطاقة التعريف',
      'إحضار الاستمارة الإدارية المعنية'
    ],
    procedureFr: [
      'Examen clinique',
      'Dépistage des maladies contagieuses selon les exigences',
      'Délivrance du certificat'
    ],
    procedureAr: [
      'فحص سريري',
      'الكشف عن الأمراض المعدية حسب المتطلبات',
      'تسليم الشهادة'
    ],
    faqs: [
      {
        qFr: 'Quelles maladies sont dépistées ?',
        qAr: 'ما الأمراض التي يتم الكشف عنها؟',
        aFr: "Selon les exigences administratives, un dépistage de la tuberculose et d'autres maladies contagieuses peut être réalisé.",
        aAr: 'حسب المتطلبات الإدارية، يمكن إجراء الكشف عن السل وأمراض معدية أخرى.'
      }
    ]
  },
  {
    id: 'certificat_repos_maladie',
    titleFr: 'Certificat médical de repos (arrêt maladie) après consultation',
    titleAr: 'شهادة طبية للراحة (توقف عن العمل) بعد الاستشارة',
    shortDescFr: "Après consultation, délivrance d'un certificat médical de repos (arrêt maladie) pour justifier une absence auprès de l'employeur ou de l'assurance.",
    shortDescAr: 'بعد الاستشارة، تسليم شهادة طبية للراحة (توقف عن العمل) لتبرير الغياب لدى المشغل أو التأمين.',
    fullDescFr: `Lorsqu'un patient nécessite un repos pour raisons médicales, le Dr. NAMBOY délivre un certificat d'arrêt maladie précisant la durée et les motifs médicaux, conformément à la réglementation en vigueur.`,
    fullDescAr: `عندما يحتاج المريض إلى راحة لأسباب طبية، يسلم الدكتور نامبوي شهادة توقف عن العمل تحدد المدة والأسباب الطبية، وفقاً للتنظيمات الجاري بها العمل.`,
    image: '/images/certificat-repos-maladie.jpeg',
    iconName: 'FileText',
    badgeFr: 'Arrêt maladie',
    badgeAr: 'توقف عن العمل',
    is24h: false,
    indicationsFr: [
      'Arrêt de travail pour maladie',
      'Repos post-opératoire',
      'Congé maladie pour affection aiguë ou chronique'
    ],
    indicationsAr: [
      'توقف عن العمل بسبب المرض',
      'راحة بعد عملية جراحية',
      'عطلة مرضية لمرض حاد أو مزمن'
    ],
    equipmentFr: [
      "Matériel d'examen clinique",
      'Formulaire de certificat médical'
    ],
    equipmentAr: [
      'أدوات الفحص السريري',
      'استمارة الشهادة الطبية'
    ],
    preparationFr: [
      'Consulter le médecin pour évaluation',
      'Apporter les documents médicaux antérieurs si nécessaire'
    ],
    preparationAr: [
      'استشارة الطبيب للتقييم',
      'إحضار الوثائق الطبية السابقة إن وجدت'
    ],
    procedureFr: [
      'Consultation médicale',
      "Évaluation de l'état de santé",
      'Rédaction et délivrance du certificat de repos'
    ],
    procedureAr: [
      'استشارة طبية',
      'تقييم الحالة الصحية',
      'تحرير وتسليم شهادة الراحة'
    ],
    faqs: [
      {
        qFr: 'Le certificat est-il délivré le jour même ?',
        qAr: 'هل تُسلم الشهادة في نفس اليوم؟',
        aFr: "Oui, après la consultation et si l'état de santé le justifie, le certificat est délivré immédiatement.",
        aAr: 'نعم، بعد الاستشارة وإذا استدعت الحالة الصحية ذلك، تُسلم الشهادة فوراً.'
      }
    ]
  }
];
import { MedicalService } from '../types';

export const MEDICAL_SERVICES: MedicalService[] = [
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
    titleFr: 'Diagnostics, Échographie & ECG',
    titleAr: 'التشخيص الطبي، الفحص بالصدى وتخطيط القلب',
    shortDescFr: 'Plateau diagnostique haute précision sur place : échographies abdominales, hépato-biliaires, pelviennes, suivi de grossesse 3D/Doppler et ECG 12 dérivations immédiat.',
    shortDescAr: 'تجهيزات تشخيصية فائقة الدقة بالعيادة : فحص بالصدى للبطن، الكبد، الحوض، تتبع الحمل وتخطيط كهربية القلب (ECG) الفوري.',
    fullDescFr: `Disposer des outils de diagnostic modernes sur place est essentiel pour poser un diagnostic rapide sans faire perdre de temps au patient. Le Dr. NAMBOY Evrard Simplice, titulaire de diplômes universitaires de Rabat en échographie générale et d'urgence, réalise lui-même vos examens échographiques et cardiologiques.

Grâce à notre échographe numérique haute définition avec sondes convexe, superficielle et endocavitaire, nous visualisons avec une netteté remarquable les organes abdominaux, la sphère gynéco-obstétricale et les vaisseaux. L'électrocardiogramme 12 dérivations est interprété instantanément.`,
    fullDescAr: `إن توفر أحدث أجهزة التشخيص داخل العيادة يضمن تشخيصاً دقيقاً وسريعاً دون إضاعة وقت المريض في التنقل. يتولى الدكتور نامبوي إيفرارد سيمبليس، الحاصل على شواهد جامعية عليا بالرباط في الفحص بالصدى (Échographie)، إجراء كافة الفحوصات بنفسه.

بفضل جهاز الصدى الرقمي المتطور المزود بمجسات متعددة الأبعاد، نوفر صوراً دقيقة لأعضاء البطن، الجهاز التناسلي، وتتبع أطوار الجنين، إضافة إلى تخطيط كهربية القلب (ECG) الفوري وتفسيره في الحين.`,
    image: '/images/Echographie-cardiaque-ce-que-montre-cet-examen-du-coeur.jpg',
    iconName: 'Activity',
    badgeFr: 'Plateau Moderne',
    badgeAr: 'تجهيزات متطورة',
    is24h: false,
    indicationsFr: [
      'Échographie abdominale : foie, vésicule biliaire (calculs), pancréas, rate, aorte abdominale',
      'Échographie rénale et vésico-prostatique : calculs rénaux, coliques néphrétiques, hypertrophie de la prostate',
      'Échographie obstétricale : confirmation de vitalité, datation, biométrie fœtale, morphologie et bien-être du bébé',
      'Échographie pelvienne gynécologique : utérus, ovaires, kystes, fibromes et surveillance endométriale',
      'Échographie thyroïdienne et des parties molles (adénopathies, kystes sébacés, hernies)',
      'Électrocardiogramme (ECG) de repos : dépistage des troubles du rythme, ischémie myocardique et surveillance thérapeutique'
    ],
    indicationsAr: [
      'فحص الصدى للبطن : الكبد، المرارة (الحصى)، البنكرياس، الطحال والشريان الأورطي',
      'فحص الكلى والمثانة والبروستات : حصى الكلى، المغص الكلوي الحاد وتضخم البروستات',
      'فحص الحمل وتتبع الجنين : نبض الجنين، تحديد عمر الحمل، نمو الأعضاء وسلامة المشيمة',
      'فحص الحوض وأمراض النساء : الرحم، المبيضين، الأكياس، الألياف وبطانة الرحم',
      'فحص الغدة الدرقية والأنسجة الرخوة والانتفاخات',
      'تخطيط كهربية القلب (ECG) : كشف اضطرابات النبض، قصور الشرايين التاجية ومتابعة أدوية القلب'
    ],
    equipmentFr: [
      'Échographe couleur doppler haute résolution avec sondes multifréquences',
      'Électrocardiographe 12 pistes numérique haute sensibilité avec tracé imprimé',
      'Négatoscope mural professionnel pour lecture radiographique instantanée',
      'Table d’examen ergonomique capitonnée avec protections hygiéniques à usage unique'
    ],
    equipmentAr: [
      'جهاز فحص بالصدى رقمي متطور مزود بتقنية الدوبلر الملون ومجسات عالية التردد',
      'جهاز تخطيط القلب الرقمي بـ 12 مساراً فائق الحساسية مع طباعة فورية للتقرير',
      'جهاز قراءة وتفسير صور الأشعة الصدرية والعظمية (Négatoscope)',
      'سرير فحص طبي مريح ومجهز بأغطية معقمة أحادية الاستعمال'
    ],
    preparationFr: [
      'Pour une échographie abdominale : être strictement à jeun de nourriture depuis 4 à 6 heures (boire un peu d’eau plate reste autorisé)',
      'Pour une échographie pelvienne ou rénale : boire 3 à 4 verres d’eau une heure avant l’examen et ne pas uriner pour garder la vessie pleine',
      'Pour un ECG : porter des vêtements faciles à déboutonner au niveau du torse et éviter d’appliquer des crèmes grasses sur la peau avant l’examen'
    ],
    preparationAr: [
      'لفحص البطن بالصدى : الصيام عن الأكل لمدة 4 إلى 6 ساعات قبل الفحص (يُسمح بشرب قليل من الماء)',
      'لفحص الحوض أو الكلى والمثانة : شرب 3 إلى 4 كؤوس من الماء قبل ساعة من الفحص والامتناع عن التبول لتكون المثانة ممتلئة',
      'لتخطيط القلب (ECG) : ارتداء ملابس سهلة الفتح في منطقة الصدر وتجنب وضع مراهم أو كريمات دهنية على الجلد'
    ],
    procedureFr: [
      'Installation confortable du patient sur la table d’examen',
      'Application d’un gel hypoallergénique conducteur à température ambiante',
      'Exploration méthodique des organes par le Dr. NAMBOY avec explications en temps réel sur l’écran de contrôle',
      'Capture des images clés et prise des mesures biométriques nécessaires',
      'Remise immédiate du compte-rendu médical commenté et des clichés photographiques'
    ],
    procedureAr: [
      'استلقاء المريض براحة تامة على سرير الفحص الطبي',
      'وضع مادة الجل الطبية المعقمة والموصلة للموجات الصوتية',
      'فحص دقيق ومنهجي للأعضاء من قِبل الدكتور نامبوي مع تقديم شروحات مباشرة على الشاشة',
      'التقاط الصور الرئيسية وأخذ القياسات البيومترية الدقيقة',
      'تسليم فوري لتقرير الفحص الطبي الشامل مصحوباً بالصور والشروحات'
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
  }
];

/**
 * Project catalog: the single source of truth for the whole site.
 *
 * The landing grid (main.js) and every case-study page (project.js) read from
 * this one array. To add a project: append an object and drop its image in
 * images/projects/. Nothing else needs to change.
 *
 * Fields:
 *   id        - unique slug; the sub-page sets <body data-project-id="…">
 *   title     - full display title
 *   domain    - short category label
 *   teaser    - one-line summary (grid card + sub-page lead)
 *   image     - preview picture (relative to the site root)
 *   url       - dedicated case-study page
 *   status    - "complete" | "in-progress"
 *   repo      - GitHub URL, or null
 *   facts     - [{ label, value }] key facts shown on the sub-page
 *   stack     - technology tags
 *   caseStudy - narrative sections; each is an array whose items are either a
 *               string (paragraph) or { list: [ … ] } (bullet list):
 *                 context     → "Context & the Why"
 *                 approach    → "Technical Approach & Design Choices"
 *                 reflections → "Personal Reflections & Engineering Gaps"
 */
const PROJECTS = [
    // Project Starlight is removed until its case study is finished.
    // Re-add the object here (status: "in-progress") when ready.
    {
        id: "jaguar",
        title: "Jaguar Re Identification",
        domain: "Computer Vision",
        teaser: "Identifying individual jaguars from camera trap photos by their rosette patterns, a fine grained metric learning problem.",
        image: "images/projects/jaguar-cover.png",
        url: "jaguar.html",
        status: "complete",
        repo: "https://github.com/jfbami/Jaguar-Re-Identification",
        facts: [
            { label: "Domain", value: "Computer Vision" },
            { label: "Backbone", value: "ConvNeXt Base" },
            { label: "Head", value: "ArcFace" },
            { label: "Validation", value: "5 fold grouped" },
        ],
        stack: ["PyTorch", "ConvNeXt", "ArcFace", "Perceptual Hashing", "k Reciprocal Re ranking"],
        caseStudy: {
            context: [
                "Turning camera trap photos into population counts requires identifying individual jaguars by their unique, asymmetric rosette patterns. This is complicated by severe class imbalances and rapid burst fire frames that can easily leak across train/validation splits and falsely inflate metrics.",
                {
                    images: [
                        { src: "images/projects/jaguar-problem-1.png", alt: "Jaguar walking in daylight" },
                        { src: "images/projects/jaguar-problem-2.png", alt: "Jaguar partly occluded and blurred" },
                    ],
                    caption: "Different individuals under changing pose, lighting, occlusion, and motion blur. Telling them apart by rosette pattern alone is exactly what makes a high similarity score hard to earn.",
                },
            ],
            approach: [
                "The model pairs a ConvNeXt Base backbone with an ArcFace metric learning head, so images of the same individual are pulled together in embedding space and different individuals are pushed apart, the right framing for fine grained, open set identification where unseen animals appear at test time.",
                {
                    list: [
                        "Leakage control: burst frames are grouped with perceptual hashing (pHash, Hamming distance ≤ 8) and split with StratifiedGroupKFold across 5 folds, so near duplicates stay together while class balance is preserved.",
                        "No horizontal flipping in augmentation, since flipping would corrupt the left/right asymmetry of the rosettes. Variation comes instead from RandomResizedCrop, ColorJitter, and RandomGrayscale.",
                        "Ensemble inference averages and L2 normalizes the embeddings from all five fold models, worth a 1–3% improvement over any single fold.",
                        "k reciprocal re ranking refines the final similarity scores between mutually nearest pairs.",
                    ],
                },
            ],
            reflections: [
                "The decisions that mattered most here were about data hygiene rather than architecture. Burst frame leakage and flank asymmetry are exactly the kind of problems that quietly inflate validation metrics and then collapse in deployment, so most of the engineering went into the grouping and augmentation strategy.",
            ],
        },
    },
    {
        id: "intersection",
        title: "Intersection Risk Model",
        domain: "Road Safety Analytics",
        teaser: "A Vision Zero risk model that ranks Capitol Hill's 346 arterial intersections and recommends evidence based safety treatments.",
        image: "images/projects/intersection-map.png",
        url: "intersection.html",
        status: "complete",
        repo: "https://github.com/jfbami/intersection-risk-model",
        facts: [
            { label: "Scope", value: "346 intersections" },
            { label: "Window", value: "2018–2023" },
            { label: "Model", value: "NB2 + Empirical Bayes" },
            { label: "Calibration", value: "within 3.1%" },
        ],
        stack: ["Python", "Negative Binomial Regression", "Empirical Bayes", "FHWA CMFs", "Mapbox"],
        caseStudy: {
            context: [
                "Seattle has committed to Vision Zero: eliminating traffic deaths and serious injuries. But safety budgets are finite, so the practical question is sharper: of the city's intersections, which deserve attention first, and what should actually be built there? This project answers that for 346 arterial intersections in Capitol Hill over 2018–2023, a window that saw 1,720 reported crashes and 16 cyclists killed or seriously injured.",
                "The work ships as an interactive front end: a risk tiered map of every intersection, a per site scorecard with expected bike KSI risk and ranked treatments, and a detail panel of crash counts, severity, and infrastructure.",
            ],
            approach: [
                "At the core is a negative binomial (NB2) regression with a log link, following the AASHTO Highway Safety Manual. Expected crashes are modeled from whether an intersection is signalized, its number of legs, posted speed, bike facility presence, arterial class, and traffic volume.",
                "The key modeling choice is using log(AADT) rather than raw traffic volume. Raw volume implies expected crashes grow exponentially with traffic; the log term instead recovers the empirically observed sub linear “safety in numbers” effect. At the fitted exponent β ≈ 0.26, doubling traffic raises expected crashes by only about 20%, not 100%.",
                {
                    list: [
                        "Empirical Bayes shrinkage (HSM Part C) pulls extreme predictions back toward observed counts, so a site that was simply lucky or unlucky over six years is not over ranked.",
                        "For cyclist KSI, a Poisson Gamma empirical Bayes step uses the all crash prediction scaled by the citywide bike KSI share as its prior, a directional proxy until a dedicated bike model lands.",
                        "Treatment recommendations multiply each site's expected bike KSI rate by (1 − CMF), using eight Crash Modification Factors curated from the FHWA Clearinghouse and filtered to approved, bike involved, intersection studies.",
                    ],
                },
                "Data is assembled from Seattle GIS intersection geometry and the SDOT collision dataset (crashes snapped within 25 m), with KSI defined by MAXSEVERITYCODE ≥ 3 and keyword matching used to backfill sparse pedestrian and bike fields. The fitted model predicts 1,772.7 total crashes against 1,720 observed (within 3.1%, inside the HSM ±15% calibration threshold), with a mean error of 3.47 crashes per intersection over six years and 95–99% predictive coverage.",
                {
                    images: [
                        { src: "images/projects/intersection-map.png", alt: "Risk tiered map of Capitol Hill intersections" },
                    ],
                    caption: "The interactive map interface: visualizing the predicted risk tiers across all 346 arterial intersections in Capitol Hill to quickly identify hotspots. Click to expand.",
                },
                {
                    images: [
                        { src: "images/projects/intersection-scorecard.png", alt: "Per site scorecard with expected bike KSI risk, median comparison, crash distribution, and ranked treatments" },
                    ],
                    caption: "The per site scorecard: expected bike KSI risk, how it compares to the Capitol Hill median, the historical crash breakdown, and CMF ranked treatments. Click to expand.",
                },
                {
                    images: [
                        { src: "images/projects/intersection-panel.png", alt: "Detail panel with crash counts, Vision Zero severity, and infrastructure" },
                    ],
                    caption: "The detail panel: empirical Bayes adjusted crash counts, Vision Zero severity, and the intersection's infrastructure and location. Click to expand.",
                },
            ],
            reflections: [],
        },
    },
    {
        id: "sales",
        title: "Sales Forecasting",
        domain: "Time Series Forecasting",
        teaser: "Forecasting 16 days of unit sales across 33 product families and 54 Favorita grocery stores with a weighted model ensemble.",
        image: "images/projects/01_overall_trend.png",
        url: "sales.html",
        status: "complete",
        repo: "https://github.com/jfbami/Sales-forcasting",
        facts: [
            { label: "Domain", value: "Time Series Forecasting" },
            { label: "Horizon", value: "16 days" },
            { label: "Scope", value: "33 families × 54 stores" },
            { label: "Ensemble", value: "XGB · LGBM · SVR" },
        ],
        stack: ["Python", "XGBoost", "LightGBM", "LinearSVR", "TimeSeriesSplit"],
        caseStudy: {
            context: [
                "The problem is forecasting daily unit sales for thousands of product families across Favorita's grocery stores in Ecuador: predicting the next 16 days for 33 product families and 54 stores, from the Kaggle competition data. Retail demand is noisy and seasonal, and the cost of being wrong is asymmetric: overstock spoils, understock loses sales.",
            ],
            approach: [
                "The plots tell the story of the data and are the foundation for the engineered features.",
                { heading: "The macro picture: trend, seasonality, growth" },
                {
                    images: [
                        { src: "images/projects/04_yearly_growth.png", label: "Year over year growth" },
                    ],
                },
                "Sales grow steadily year over year with strong end of year peaks. The April 2016 earthquake produces a clear, dateable shock that gets captured later as a dedicated feature.",
                { heading: "Calendar effects: weekday, month, payday" },
                {
                    images: [
                        { src: "images/projects/02_day_of_week.png", label: "Day of week" },
                        { src: "images/projects/03_monthly_seasonality.png", label: "Monthly seasonality" },
                        { src: "images/projects/10_payday_effect.png", label: "Payday effect" },
                    ],
                },
                "Weekends dominate, December spikes, and pay cycle days (15th and end of month) lift sales by a meaningful amount. All of these are encoded as binary features.",
                { heading: "Product mix and store segmentation" },
                {
                    images: [
                        { src: "images/projects/05_family_sales.png", label: "Sales by family" },
                        { src: "images/projects/06_store_type.png", label: "Sales by store type" },
                    ],
                },
                "Sales are heavily concentrated in a handful of families (GROCERY I, BEVERAGES, PRODUCE), and store type drives a large share of the variance.",
                { heading: "External signals: oil, promotions, transactions" },
                {
                    images: [
                        { src: "images/projects/07_oil_vs_sales.png", label: "Oil vs sales" },
                        { src: "images/projects/08_promotion_effect.png", label: "Promotion effect" },
                        { src: "images/projects/12_transactions_vs_sales.png", label: "Transactions vs sales" },
                    ],
                },
                "Ecuador's oil dependent economy shows up clearly. The oil price moves inversely to sales with a lag, which is what motivates the 14 day lagged oil feature. Promotions roughly double family level sales when active.",
                { heading: "Shocks and autocorrelation" },
                {
                    images: [
                        { src: "images/projects/09_earthquake.png", label: "2016 Earthquake impact" },
                        { src: "images/projects/11_autocorrelation.png", label: "Autocorrelation (lag 7)" },
                    ],
                },
                "The post earthquake demand surge is sharp and short lived, so a one month flag (Apr 16 to May 15, 2016) handles it. The lag 7 autocorrelation is the single strongest signal in the data, which is why the pipeline leans heavily on weekly seasonal lags.",
                "Rather than betting on one model, the solution is a weighted ensemble of three complementary learners, blended by inverse RMSLE validation score:",
                {
                    list: [
                        "XGBoost with a reg:squaredlogerror objective, chosen to optimize the competition's RMSLE metric directly.",
                        "LightGBM trained with RMSE on log transformed targets, which is faster and complementary to XGBoost's errors.",
                        "LinearSVR in log space with scaled features, providing a smooth linear baseline that steadies the blend.",
                    ],
                },
                "The real work is in the features: more than 50 of them, each motivated by a pattern in the exploratory plots: calendar effects (weekday, payday flags), sales lags from 16–56 days plus a 364 day yearly lag, rolling statistics over 7/14/28/91 day windows, a 14 day lagged oil price (Ecuador's economy tracks oil), and promotion counts. Hyperparameters were tuned with RandomizedSearchCV over a 3 fold TimeSeriesSplit, then the models were retrained on the full history before predicting.",
            ],
            reflections: [],
        },
    },
    {
        id: "unet",
        title: "U Net Filling Shapes",
        domain: "Computer Vision",
        teaser: "A U Net that takes an outlined or partial shape and reconstructs the complete, filled mask.",
        image: "images/projects/unet-cover.png",
        url: "unet.html",
        status: "complete",
        repo: "https://github.com/jfbami/unetfillingshapes",
        facts: [
            { label: "Domain", value: "Semantic Segmentation" },
            { label: "Architecture", value: "DeepUNet (CNN)" },
            { label: "Output", value: "Single channel mask" },
        ],
        stack: ["PyTorch", "DeepUNet", "CNN"],
        caseStudy: {
            context: [
                "The task is shape completion: given a black and white image holding only the outline (or a partial outline) of a shape, reconstruct the solid, filled version. The system has to generalize across rectangles, circles, ellipses, curves, and points at different scales and positions, rather than memorizing a fixed set of templates.",
            ],
            approach: [
                "The model is a DeepUNet, a fully convolutional encoder decoder. Successive downsampling blocks in the encoder extract shape features; a dense bottleneck holds the compressed representation; and the decoder upsamples back to full resolution, using skip connections from the encoder to preserve the fine edges that pure downsampling would blur. The output is a single channel binary mask of the filled shape.",
                "An encoder decoder with skip connections is the natural fit: filling a shape is a dense, pixel to pixel mapping where both global structure (which kind of shape) and local detail (exactly where the boundary sits) have to survive the bottleneck.",
            ],
            reflections: [
                "What works well is the breadth of shapes a single network handles, from outline to fill. The clearest gap is evaluation: results are currently shown qualitatively through input/output pairs, without a quantitative metric such as Dice or IoU, which would be the first thing to add before pushing toward noisier, real world inputs.",
            ],
        },
    },
];

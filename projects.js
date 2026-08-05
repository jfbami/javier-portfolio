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
        domain: "A/B Testing & Statistical Modeling",
        teaser: "A risk model that ranks Capitol Hill's 346 intersections and recommends evidence based safety treatments.",
        image: "images/projects/intersection-map.png",
        url: "intersection.html",
        status: "complete",
        repo: "https://github.com/jfbami/intersection-risk-model",
        links: [
            {
                label: "Plain English results, with charts",
                url: "https://github.com/jfbami/intersection-risk-model/blob/main/RESULTS.md",
            },
            {
                label: "Full technical detail",
                url: "https://github.com/jfbami/intersection-risk-model/blob/main/EXPERIMENTS.md",
            },
        ],
        stack: ["Python", "Negative Binomial Regression", "Empirical Bayes", "FHWA CMFs", "Mapbox"],
        caseStudy: {
            order: ["context", "approach", "validation"],
            context: [
                "The North Star metric: expected cyclist KSI, killed or seriously injured, per intersection per year.",
                "Seattle has committed to Vision Zero, eliminating traffic deaths and serious injuries, but safety budgets are finite, so the practical question is which intersections to fix first.",
                {
                    link: {
                        prefix: "Link to learn more: ",
                        label: "https://www.seattle.gov/transportation/projects-and-programs/safety-first/vision-zero",
                        url: "https://www.seattle.gov/transportation/projects-and-programs/safety-first/vision-zero",
                    },
                },
                "Across 346 intersections in Capitol Hill the data has 1,720 reported crashes and 16 cyclists killed or seriously injured. Sixteen events across 346 sites is a thin signal.",
                "Data scarcity is the largest modelling problem in this project.",
                "A lot of the design decisions are made to fit under this constraint to be able to accurately predict KSI.",
            ],
            approach: [
                "We use a negative binomial regression model with a log link. Three models run rather than one, each targeting a different crash type: bike (169 events), pedestrian (266 events), and vehicle only (1,295 events).",
                "All three share the same predictor block so their coefficients line up side by side: signalization, number of approaches as a top coded category rather than a continuous count, posted speed, bike facility presence, and arterial class. Each carries an exposure offset of log(years observed). Only the volume term differs. The pedestrian and vehicle models use log(AADT); the bike model swaps in a bike network centrality score.",
                "Using log(AADT) rather than raw traffic volume mattered a lot as the raw volume implies expected crashes grow exponentially with traffic; the log term instead recovers the empirically observed sub linear “safety in numbers” effect (describes the phenomenon where an individual in a large group or mass has a lower relative risk).",
                "At the fitted exponent β ≈ 0.226, doubling traffic raises expected crashes by about 17%.",
                {
                    list: [
                        "Empirical Bayes shrinkage pulls our extreme predictions back toward observed counts.",
                        "Cyclist KSI comes from the bike crash model. Its prediction is multiplied by the citywide share of bike crashes that were KSI (16 of 169, or 9.5%) to form a prior, and a Poisson Gamma empirical Bayes step then returns a posterior mean and a 90% credible interval. KSI is not modelled directly because 16 events against 11 predictors will not support a stable fit. This severity share step is the standard workaround, and it is the largest single source of modelling risk in the project.",
                        "Our recommendations multiply each site's expected bike KSI rate by (1 − CMF), using Crash Modification Factors curated from the FHWA Clearinghouse and filtered to approved, intersection related, non rural studies. This holds 11 treatments: 8 bike, 1 pedestrian, 2 vehicle.",
                    ],
                },
                "Data is collected from Seattle GIS intersection geometry and the SDOT collision dataset.",
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
            validation: [
                { heading: "The experiment that caught an error we made" },
                "The question: should the number of roads meeting at an intersection enter the model as a scaling number or as separate categories?",
                "The scaling number test loses decisively in all three models (likelihood ratio p = 0.0088, 9.0e-08, and 1.5e-07). It predicts that a 6-road intersection is 283% more dangerous than a 4-road one. The data holds three real 6-road intersections, and they are slightly safer, at 0.79 times the risk.",
                "The pattern that we found is that 3 road intersections are far safer than 4 road ones, roughly one fifth the risk. This was the change that produced the largest measured accuracy gain.",
                {
                    plate: true,
                    images: [
                        {
                            src: "images/projects/e5_extrapolation_vs_reality.png",
                            alt: "Predicted vs actual crash risk by number of intersection legs, showing the linear extrapolation diverging from the observed data at 6 legs.",
                        },
                    ],
                    caption: "The red line is what a linear per leg term predicts. The blue squares are what the data actually shows. Click to expand.",
                },
                { heading: "A/B test # 2" },
                "The question: Negative Binomial or Poisson? Negative Binomial wins decisively, but only on uncertainty. Poisson's 90% prediction intervals contain the true value just 77% of the time for vehicle crashes, against 95% for Negative Binomial, and 81 of 346 intersections fall outside an interval meant to catch nearly all of them. For the single predicted number the two are statistically indistinguishable (paired p = 0.48, 0.26, 0.83).",
                {
                    plate: true,
                    images: [
                        {
                            src: "images/projects/e2_interval_coverage.png",
                            alt: "Interval coverage by model family across bike, pedestrian and vehicle crashes, with Poisson far below the 90% target for vehicles.",
                        },
                    ],
                    caption: "A 90% range should contain the real answer about 90% of the time. Poisson's does not. Click to expand.",
                },
                { heading: "The experiment that went against the shipped design" },
                "The question: does fitting three separate models beat one shared model? Out of sample, no. The three model split spends 36 parameters against the shared model's 12, and a formal test found no coefficient behaving differently across crash types (p = 0.643). The change that used three models did improve accuracy, but the gain came from fixing the geometry term above and not from the split.",
                "The reason to keep three models is that the product shows bike, pedestrian, and vehicle risk separately and lets you compare them. That is for interpretability.",
                {
                    plate: true,
                    images: [
                        {
                            src: "images/projects/e4_pooled_vs_permode.png",
                            alt: "Out of sample error for the old model, a shared model with the geometry fix, and three separate models, showing most of the gain comes from the geometry fix.",
                        },
                    ],
                    caption: "Nearly all the improvement came from the geometry fix, not from splitting into three models. Click to expand.",
                },
                { heading: "What this data cannot do" },
                "Neither a bike network centrality score nor traffic volume predicts bike crashes at this sample size. The dataset was severely imbalanced. For a future change getting access to cyclist counts from something like the Strava Metro would give us better data to work with.",
            ],
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

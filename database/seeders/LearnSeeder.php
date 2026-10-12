<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class LearnSeeder extends Seeder
{
    /**
     * The first Learn lessons. Facts were checked against the listed sources in October 2026.
     * [n] in lesson text cites the lesson's n-th source.
     * Safe to run more than once: topics and lessons are matched by slug, and sources are replaced.
     */
    public function run(): void
    {
        $topics = [
            [
                'slug' => 'rice-in-cambodia',
                'title' => 'Rice in Cambodia',
                'description' => 'How rice shaped Cambodia\'s language, history, ceremonies and economy.',
                'icon' => '🇰🇭',
                'lessons' => [$this->funFacts()],
            ],
            [
                'slug' => 'how-rice-grows',
                'title' => 'How Rice Grows',
                'description' => 'The life of a rice plant from seed to harvest, how each of its parts works, and the science behind its scent, stickiness and survival.',
                'icon' => '🌱',
                'lessons' => [$this->seedToHarvest(), $this->insideTheRicePlant(), $this->riceScience()],
            ],
            [
                'slug' => 'rice-culture-belief',
                'title' => 'Rice in Khmer Culture & Belief',
                'description' => 'Two thousand years of history, the legends and old books, and the spirits, royal rites and Buddhist festivals that grew up around rice.',
                'icon' => '🪷',
                'lessons' => [$this->riceHistory(), $this->riceLore(), $this->riceAndReligion()],
            ],
        ];

        foreach ($topics as $topicPosition => $topicData) {
            $lessons = $topicData['lessons'];
            unset($topicData['lessons']);

            $topic = Topic::updateOrCreate(
                ['slug' => $topicData['slug']],
                $topicData + ['position' => $topicPosition],
            );

            foreach ($lessons as $lessonPosition => $lessonData) {
                $sources = $lessonData['sources'];
                unset($lessonData['sources']);

                $lesson = Lesson::updateOrCreate(
                    ['topic_id' => $topic->id, 'slug' => $lessonData['slug']],
                    $lessonData + ['position' => $lessonPosition, 'published' => true],
                );

                $lesson->sources()->delete();
                foreach ($sources as $index => $source) {
                    $lesson->sources()->create($source + ['position' => $index + 1]);
                }
            }
        }
    }

    // A quiz question. The first choice is the right one: the quiz shuffles them before showing them.
    private function question(string $question, array $choices, string $explain): array
    {
        return ['question' => $question, 'choices' => $choices, 'answer' => 0, 'explain' => $explain];
    }

    private function funFacts(): array
    {
        return [
            'slug' => 'fun-facts',
            'title' => 'Fun Facts About Cambodian Rice',
            'summary' => 'Seven surprising facts about the crop at the heart of Cambodian life.',
            'body' => 'Rice is more than food in Cambodia. It is in the language people speak, the ceremonies of the royal palace, the ruins of Angkor and the country\'s exports. Each fact links to the source it came from.',
            'layout' => 'cards',
            'level' => 'beginner',
            'items' => [
                [
                    'icon' => '🍚',
                    'title' => '"To eat" means "to eat rice"',
                    'text' => 'In Khmer, the everyday verb for eating literally means "eat rice".[1]',
                    'details' => 'The phrase is ញ៉ាំបាយ (nham bay, also written "yam bai"): ញ៉ាំ means "eat" and បាយ means cooked rice. In everyday speech, eating a meal and eating rice are the same thing. The writer Richard Parks pointed this out in a 2012 Lucky Peach article about Cambodian-American food.[1]',
                ],
                [
                    'icon' => '🏆',
                    'title' => 'World\'s Best Rice, seven times',
                    'text' => 'Cambodia\'s Phka Rumduol jasmine rice has been named World\'s Best Rice seven times.[2][3][4]',
                    'details' => 'It won in 2012, 2013, 2014, 2018, 2022, 2024 and 2025 at the World Rice Conference run by The Rice Trader. Phka Rumduol was developed and tested by the Cambodian Agricultural Research and Development Institute (CARDI), released in 1999, and is sold abroad under the "Malis Angkor" brand. In 2025 the conference came to Phnom Penh, where Phka Rumduol shared first place with Vietnam\'s ST25 out of more than 30 varieties.[2][3][4]',
                ],
                [
                    'icon' => '🛕',
                    'title' => 'Angkor was built around water',
                    'text' => 'Angkor was the largest pre-industrial settlement complex in the world, held together by canals and reservoirs.[5]',
                    'details' => 'A 2007 study used airborne radar from NASA/JPL to map nearly 3,000 km² around Angkor. It found a spread-out landscape of homes, temples and fields linked by a water-management network covering more than 1,000 km². The authors also argue that changing the landscape on such a scale created serious problems for the city in the long run.[5]',
                ],
                [
                    'icon' => '🌊',
                    'title' => 'A river that runs backwards',
                    'text' => 'Every wet season the Tonle Sap River reverses direction, and Tonle Sap Lake roughly triples in size.[6]',
                    'details' => 'For most of the year the Tonle Sap River carries water out of the lake into the Mekong. In the wet season (about June to November) the flooding Mekong pushes water back up the river, and the lake grows from about 3,000 km² to about 10,000 km², flooding the forests and rice fields around it. The yearly exchange also helps balance fresh water and seawater in the Mekong Delta downstream.[6]',
                ],
                [
                    'icon' => '🐂',
                    'title' => 'Royal oxen predict the harvest',
                    'text' => 'Every year, the royal oxen "forecast" the coming harvest at the Royal Ploughing Ceremony.[7]',
                    'details' => 'The ceremony marks the start of the rice-growing season. The royal oxen are offered rice, corn, beans, sesame, grass, water and rice wine, and what and how much they eat is read as a forecast for the year. At the ceremony VOA reported on, presided over by King Norodom Sihamoni in Takeo Province, the oxen ate 85% of the rice, 90% of the corn and 85% of the beans, which was announced as a sign of bigger harvests.[7]',
                ],
                [
                    'icon' => '🌾',
                    'title' => 'Two-thirds of all crops',
                    'text' => 'Rice is planted on two-thirds of all the cropped land in Cambodia.[8]',
                    'details' => 'The Census of Agriculture Cambodia 2023 found that 66.6% of the country\'s total cropped area is planted with rice, far more than any other crop. The census was carried out by the National Institute of Statistics with the Ministry of Agriculture, Forestry and Fisheries and technical support from the FAO, and its results were launched on 19 May 2025.[8]',
                ],
                [
                    'icon' => '🚢',
                    'title' => 'Shipped to 67 countries',
                    'text' => 'In the first 11 months of 2024, Cambodian milled rice was shipped to 67 countries.[9]',
                    'details' => 'From January to November 2024, Cambodia exported 575,562 tonnes of milled rice worth about US$413 million, according to the Cambodia Rice Federation. Europe bought the most (283,981 tonnes across 26 countries), followed by seven ASEAN neighbours (113,792 tonnes) and China (109,448 tonnes). The shipments included fragrant, organic, white, parboiled and japonica rice. Counting unmilled paddy too, rice exports earned about US$1.79 billion.[9]',
                ],
            ],
            'quiz' => [
                $this->question('In Khmer, the everyday word for "to eat" literally means…', ['Eat rice', 'Eat fish', 'Sit together', 'Fill the bowl'], 'The phrase is ញ៉ាំបាយ (nham bay): ញ៉ាំ means "eat" and បាយ means cooked rice. Eating a meal and eating rice are the same thing.'),
                $this->question('How many times has Cambodia\'s Phka Rumduol been named World\'s Best Rice?', ['Seven', 'Once', 'Three', 'Ten'], 'It won in 2012, 2013, 2014, 2018, 2022, 2024 and 2025 at the World Rice Conference run by The Rice Trader.'),
                $this->question('What does the Tonle Sap River do every wet season?', ['It flows backwards', 'It dries up', 'It turns red', 'It stops flowing'], 'The flooding Mekong pushes water back up the river, and Tonle Sap Lake grows from about 3,000 km² to about 10,000 km².'),
                $this->question('At the Royal Ploughing Ceremony, who "forecasts" the coming harvest?', ['The royal oxen', 'A white elephant', 'A flock of birds', 'The oldest farmer'], 'The oxen are offered rice, corn, beans, sesame, grass, water and rice wine, and what they eat is read as a forecast for the year.'),
                $this->question('About how much of Cambodia\'s cropped land is planted with rice?', ['Two-thirds', 'One-tenth', 'One-third', 'Almost all of it'], 'The Census of Agriculture Cambodia 2023 found that 66.6% of the country\'s cropped area is planted with rice.'),
                $this->question('In the first 11 months of 2024, Cambodian milled rice was shipped to how many countries?', ['67', '7', '12', '150'], 'From January to November 2024, Cambodia exported 575,562 tonnes of milled rice to 67 countries, according to the Cambodia Rice Federation.'),
            ],
            'sources' => [
                ['title' => 'In the Khmer language, the verb "to eat" literally translates as "eat rice"', 'publisher' => 'Longreads, excerpt from Lucky Peach (Summer 2012)', 'url' => 'https://longreads.com/2015/04/21/in-the-khmer-language-the-verb-to-eat-literally-translates-as-eat-rice/'],
                ['title' => 'Cambodia\'s jasmine rice variety selected as the World\'s Best Rice', 'publisher' => 'Rice Today, International Rice Research Institute (IRRI)', 'url' => 'https://ricetoday.irri.org/cambodias-jasmine-rice-variety-selected-as-the-worlds-best-rice'],
                ['title' => 'Cambodian fragrant rice wins "World\'s Best Rice" award for sixth time', 'publisher' => 'The Phnom Penh Post (November 2024)', 'url' => 'https://phnompenhpost.com/national/cambodian-fragrant-rice-wins-world-s-best-rice-award-for-sixth-time/'],
                ['title' => 'Vietnam\'s ST25 rice named the world\'s best rice', 'publisher' => 'VnEconomy (November 2025)', 'url' => 'https://en.vneconomy.vn/vietnams-st25-rice-named-the-worlds-best-rice.htm'],
                ['title' => 'A comprehensive archaeological map of the world\'s largest preindustrial settlement complex at Angkor, Cambodia', 'publisher' => 'Evans et al., Proceedings of the National Academy of Sciences (2007)', 'url' => 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1964867'],
                ['title' => 'Mekong Floods Fill Tônlé Sap', 'publisher' => 'NASA Earth Observatory', 'url' => 'https://science.nasa.gov/earth/earth-observatory/mekong-floods-fill-tonle-sap-1778'],
                ['title' => 'Royal Oxen Ploughing Ceremony Predicts Bumper Rice Harvest', 'publisher' => 'VOA Khmer', 'url' => 'https://khmer.voanews.com/a/royal-oxen-ploughing-ceremony-predicts-bumper-rice-harvest/4928456.html'],
                ['title' => 'Cambodia launches landmark agriculture census, revealing decade of sectoral change', 'publisher' => 'Food and Agriculture Organization of the UN (FAO), May 2025', 'url' => 'https://www.fao.org/cambodia/news/detail/cambodia-launches-landmark-agriculture-census--revealing-decade-of-sectoral-change/en'],
                ['title' => 'Cambodia nets $1.79 billion from rice exports', 'publisher' => 'Khmer Times via Vietstock (December 2024), citing the Cambodia Rice Federation', 'url' => 'https://en.vietstock.vn/2024/12/cambodia-nets-179-billion-from-rice-exports-114-593548.htm'],
            ],
        ];
    }

    private function seedToHarvest(): array
    {
        return [
            'slug' => 'seed-to-harvest',
            'title' => 'From Seed to Harvest',
            'summary' => 'Follow a rice plant through its eight growth stages and three phases.',
            'body' => "A rice plant takes about 3 to 6 months to go from seed to harvest, depending on the variety and the weather. Its life has three phases: vegetative, reproductive and ripening.[1]\n\nThe day ranges for each stage are an approximate guide for a short, ~120-day variety. Real timing depends on the variety, the season and the weather. Traditional wet-season aromatic rice such as Phka Rumduol grows for longer.",
            'layout' => 'timeline',
            'level' => 'beginner',
            'items' => [
                ['phase' => 'Vegetative', 'days' => 'Day 0–5', 'title' => 'Germination', 'text' => 'The seed soaks up water and pushes out a tiny root and shoot.'],
                ['phase' => 'Vegetative', 'days' => 'Day 5–25', 'title' => 'Seedling', 'text' => 'The first leaves unfold. Nursery seedlings are pulled and transplanted into flooded paddies.'],
                ['phase' => 'Vegetative', 'days' => 'Day 25–45', 'title' => 'Tillering', 'text' => 'Starting around the 5th or 6th leaf, the plant sends up side shoots (tillers) and becomes a leafy clump.[1]'],
                ['phase' => 'Vegetative', 'days' => 'Day 45–60', 'title' => 'Stem Elongation', 'text' => 'The stems grow taller and the plant gets ready to switch from growing leaves to making grain.'],
                ['phase' => 'Reproductive', 'days' => 'Day 60–80', 'title' => 'Panicle Initiation', 'text' => 'The young rice head (panicle) starts forming inside the stem, which swells as it grows ("booting").'],
                ['phase' => 'Reproductive', 'days' => 'Day 80–90', 'title' => 'Heading & Flowering', 'text' => 'The panicle pushes out of the stem and tiny flowers open to pollinate. Heading across a field takes 10–14 days.[1]'],
                ['phase' => 'Ripening', 'days' => 'Day 90–110', 'title' => 'Milk & Dough Grain', 'text' => 'Grains fill with a milky liquid that slowly firms up into a soft dough. The heavy heads start to bend.'],
                ['phase' => 'Ripening', 'days' => 'Day 110–120', 'title' => 'Mature Grain', 'text' => 'The field turns golden and the grain is hard, ready to harvest, thresh, dry and mill.'],
            ],
            'quiz' => [
                $this->question('About how long does a rice plant take to go from seed to harvest?', ['3 to 6 months', '2 to 3 weeks', '10 to 12 months', 'About 2 years'], 'It depends on the variety and the weather. Its life has three phases: vegetative, reproductive and ripening.'),
                $this->question('What are a rice plant\'s tillers?', ['Side shoots that turn it into a leafy clump', 'The roots that hold it in the mud', 'The flowers that open to pollinate', 'The husks around each grain'], 'Starting around the 5th or 6th leaf, the plant sends up side shoots called tillers.'),
                $this->question('What is the panicle?', ['The young rice head, where the grain grows', 'The first leaf', 'The flooded field', 'A kind of fertiliser'], 'The panicle forms inside the stem, then pushes out at heading, when tiny flowers open to pollinate.'),
            ],
            'sources' => [
                ['title' => 'Life cycle of the rice plant', 'publisher' => 'Yara', 'url' => 'https://english-master.yara.co.uk/crop-nutrition-master/rice/life-cycle-of-the-rice-plant/'],
            ],
        ];
    }

    // Each card's 'part' puts a numbered pin on the lesson's rice plant and grain diagram (see Lesson::DIAGRAM_PARTS).
    private function insideTheRicePlant(): array
    {
        return [
            'slug' => 'inside-the-rice-plant',
            'title' => 'Inside the Rice Plant',
            'summary' => 'How a rice plant breathes under water, branches into tillers, makes sugar, pollinates itself and packs its grain, part by part.',
            'body' => "Rice (Oryza sativa) is a grass that grows with its roots under water. The diagram shows the plant and one of its grains cut open, and each numbered pin matches a card.\n\nTap a pin to go to its card. Hover over a card, or tap it on a phone, to flip it for more, and follow the numbers in brackets to the sources.",
            'layout' => 'cards',
            'level' => 'beginner',
            'items' => [
                [
                    'part' => 'root',
                    'icon' => '🌱',
                    'title' => 'Roots',
                    'text' => 'Bunches of thin roots grow out of the base of the stem and anchor the plant in soft, flooded soil.[1]',
                    'details' => 'Botanists call them adventitious roots, because they sprout from the stem rather than from one main root. They help hold the plant up.[1] Inside, they are full of the air channels described on the next card, which bring oxygen down from the leaves.[2]',
                ],
                [
                    'part' => 'stem',
                    'icon' => '🫧',
                    'title' => 'Air channels: breathing under water',
                    'text' => 'Waterlogged soil is short of oxygen, yet rice roots keep breathing. The plant grows air channels, called aerenchyma, that let oxygen travel from the leaves down to the roots.[2]',
                    'details' => 'Rice makes these gas spaces by letting some cells inside its roots die on purpose, leaving tubes of air. Scientists say they play an important role in how rice survives in waterlogged fields.[2] The cut-away in the diagram is a simplified drawing of those air spaces.',
                ],
                [
                    'part' => 'tiller',
                    'icon' => '🌾',
                    'title' => 'Tillers: one seed, many stems',
                    'text' => 'A rice plant branches at its base. Buds low on the stem grow into new stems called tillers, so one seed becomes a leafy clump.[1]',
                    'details' => 'The first stem is the main, or primary, tiller. Secondary tillers grow from the first node of a primary tiller, each with leaves of its own, and each stem can end in a head of grain.[1] The From Seed to Harvest lesson shows when tillering happens.',
                ],
                [
                    'part' => 'leaf',
                    'icon' => '🍃',
                    'title' => 'Leaves: the sugar factory',
                    'text' => 'Each leaf has a sheath wrapped around the stem and a long, flat blade that catches sunlight and makes sugar by photosynthesis.[1][3]',
                    'details' => 'Rice uses the C3 kind of photosynthesis, which in hot, dry conditions is much less efficient than the C4 kind used by maize and sorghum. The C4 Rice Project, led by the University of Oxford, is trying to give rice C4 photosynthesis. In theory that could raise its productivity by 50%, double how efficiently it uses water, and help it use nitrogen better.[3]',
                ],
                [
                    'part' => 'panicle',
                    'icon' => '🎋',
                    'title' => 'The panicle: a head of grain',
                    'text' => 'At the top of each stem the plant pushes out a panicle, a branching head that carries the spikelets: the flowers that become grains.[1]',
                    'details' => 'The panicle forms at the uppermost node of the stem, and its spikelets are the rice plant\'s flowers and, later, its fruits: the grains.[1] Every grain of rice started as one of these flowers.',
                ],
                [
                    'part' => 'flower',
                    'icon' => '🌸',
                    'title' => 'Flowers that pollinate themselves',
                    'text' => 'A rice flower has six stamens, and most rice flowers pollinate themselves at the moment they open.[4]',
                    'details' => 'A flower stays open for only about an hour before it closes again. Its anthers release their pollen as it opens, right beside its own stigma, which is why self-pollination is so reliable. Researchers have found that heat at flowering time can upset this timing.[4]',
                ],
                [
                    'part' => 'hull',
                    'icon' => '🛡️',
                    'title' => 'Hull: the tough husk',
                    'text' => 'Harvested rice, called paddy, is sealed in a hard hull that makes up about 20% of its weight.[5][6]',
                    'details' => 'The hull is full of fibre and silica, and people cannot digest it, so it is the first thing a mill removes. Rice with only the hull taken off is brown rice.[5][6]',
                ],
                [
                    'part' => 'bran',
                    'icon' => '🟫',
                    'title' => 'Bran: the brown layers',
                    'text' => 'Under the hull, thin layers of bran give brown rice its colour. They hold oils, vitamins, minerals, antioxidants and protein.[6]',
                    'details' => 'Bran is about 8% of the weight of paddy.[6] Milling rubs it away, together with the germ, to make white rice: fully milled rice loses 7–8% of its weight in this step.[5]',
                ],
                [
                    'part' => 'germ',
                    'icon' => '🌰',
                    'title' => 'Germ: the baby plant',
                    'text' => 'At one end of the grain sits the germ, or embryo: the tiny plant that would sprout if the seed were sown.[6]',
                    'details' => 'The germ is only about 2% of the weight of paddy, but it is rich in oils, vitamins, minerals and protein.[6] Brown rice keeps it; milling removes it from white rice.[5]',
                ],
                [
                    'part' => 'endosperm',
                    'icon' => '🍚',
                    'title' => 'Endosperm: the white rice we eat',
                    'text' => 'The big white centre of the grain is the endosperm, about 70% of the weight of paddy. White rice is the endosperm alone.[5][6]',
                    'details' => 'It is the grain\'s store of starch, with some protein, vitamins and minerals, packed to feed the young plant when the seed sprouts.[6] The kind of starch inside decides whether cooked rice is fluffy or sticky: the next lesson explains why.',
                ],
            ],
            'quiz' => [
                $this->question('How do rice roots get oxygen in a flooded field?', ['Through air channels that carry it down from the leaves', 'They absorb it from the water', 'They grow up above the water', 'They don\'t need any oxygen'], 'Rice grows air channels, called aerenchyma, that let oxygen travel from the leaves down to the roots.'),
                $this->question('About how long does a rice flower stay open?', ['About an hour', 'About a week', 'A whole day', 'A few seconds'], 'Rice flowers close about an hour after they begin to open, and most pollinate themselves as they open.'),
                $this->question('About how much of the weight of paddy is the hull?', ['About 20%', 'About 2%', 'About 50%', 'About 70%'], 'The hull is about a fifth of the weight. It is fibre and silica, and people cannot digest it.'),
                $this->question('What is brown rice?', ['Rice with only the hull removed', 'Rice that has been roasted', 'A different species of rice', 'Rice with the bran removed but the germ left on'], 'Brown rice keeps its bran and germ. White rice is milled down to the endosperm.'),
                $this->question('Which part of the grain is white rice?', ['The endosperm', 'The bran', 'The germ', 'The hull'], 'White rice is the endosperm alone, about 70% of the weight of paddy.'),
                $this->question('What kind of photosynthesis does rice use?', ['C3, which is less efficient in hot, dry weather', 'C4, like maize', 'None: it feeds through its roots', 'The same kind as cactus'], 'Rice uses C3. The C4 Rice Project is trying to give it the more efficient C4 kind used by maize and sorghum.'),
            ],
            'sources' => [
                ['title' => 'The basic external anatomy of the rice plant', 'publisher' => 'Thomas L. Rost, Section of Plant Biology, University of California, Davis', 'url' => 'https://labs.plb.ucdavis.edu/rost/Rice/Stems/external1.html'],
                ['title' => 'How rice thrives in flooded fields', 'publisher' => 'Nancy Eckardt, Plantae (2017), on Yamauchi et al., The Plant Cell 29: 775–790', 'url' => 'https://plantae.org/how-rice-thrives-in-flooded-fields/'],
                ['title' => 'Efforts to "turbocharge" rice and reduce world hunger enter important new phase', 'publisher' => 'University of Oxford, via Newswise (December 2015)', 'url' => 'https://www.newswise.com/articles/efforts-to-turbocharge-rice-and-reduce-world-hunger-enter-important-new-phase'],
                ['title' => 'Characteristics of floral organs related to reliable self-pollination in rice (Oryza sativa L.)', 'publisher' => 'Tsutomu Matsui and Hisashi Kagata (2003), via PubMed Central', 'url' => 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4241067'],
                ['title' => 'Physical grain characteristics of paddy/milled rice and its grades and standards', 'publisher' => 'Food and Agriculture Organization of the UN (FAO)', 'url' => 'https://www.fao.org/4/x5048e/x5048E02.htm'],
                ['title' => 'Anatomy of rice', 'publisher' => 'Riceland Foods', 'url' => 'https://www.riceland.com/anatomy-of-rice'],
            ],
        ];
    }

    private function riceScience(): array
    {
        return [
            'slug' => 'rice-plant-science',
            'title' => 'Rice Science: Scent, Stickiness and Survival',
            'summary' => 'Where rice came from, why jasmine rice smells sweet, why sticky rice sticks, how rice tells the season, and how floating rice outgrows a flood.',
            'body' => "Biology explains things Cambodian farmers and cooks have long known: why some rice smells sweet, why some is sticky, why traditional rice flowers at the same time every year, and how floating rice can outgrow a flood.\n\nHover over a card, or tap it on a phone, to flip it for the science, and follow the numbers to the sources.",
            'layout' => 'cards',
            'level' => 'intermediate',
            'items' => [
                [
                    'icon' => '🧬',
                    'title' => 'A wild grass from southern China',
                    'text' => 'Cultivated rice comes from a wild rice, Oryza rufipogon. A 2012 study of more than 1,500 rice genomes traced its first domestication to the middle of the Pearl River region in southern China.[1]',
                    'details' => 'The scientists compared 446 wild rices with 1,083 cultivated varieties. Japonica rice was domesticated first; indica rice developed later from crosses between japonica and local wild rice, as farming spread into South East and South Asia.[1]',
                ],
                [
                    'icon' => '🌸',
                    'title' => 'Where the fragrance comes from',
                    'text' => 'The scent of fragrant rices such as jasmine and basmati is linked to a compound called 2-acetyl-1-pyrroline, or 2AP.[2]',
                    'details' => 'In 2005 researchers at Southern Cross University in Australia found that fragrant rices carry a broken copy of a gene on chromosome 8, called BAD2 or fgr: a mutation stops it working. The broken gene does not seem to hold the plant back, which suggests people kept choosing fragrance as they domesticated rice.[2] Cambodia\'s award-winning Phka Rumduol is a jasmine rice.[3]',
                ],
                [
                    'icon' => '🍡',
                    'title' => 'Why sticky rice is sticky',
                    'text' => 'Sticky, or glutinous, rice lacks amylose, a starch that ordinary rice contains. That missing starch is what makes it sticky.[4]',
                    'details' => 'The cause is a mutation in the Waxy gene that stops the plant making amylose. Geneticists at North Carolina State University found that the mutation happened only once, and that sticky rice originated in Southeast Asia.[4]',
                ],
                [
                    'icon' => '📅',
                    'title' => 'Flowering by the length of the night',
                    'text' => 'Rice is a short-day plant: longer nights push it to flower.[5]',
                    'details' => 'Plants sense the length of the night with light-sensitive proteins and take it as a signal to flower.[5] Varieties that respond strongly are called photoperiod-sensitive, and Cambodian and Japanese researchers studied rainfed lowland varieties of this kind in Cambodia in 2023, including Phka Rumduol.[6] Because the nights lengthen at the same time every year, such rice tends to flower at about the same time each year, whenever it was sown.',
                ],
                [
                    'icon' => '🤿',
                    'title' => 'Floating rice: racing the flood',
                    'text' => 'Around Tonle Sap Lake, farmers traditionally grew floating rice, whose stems could stretch up to five metres as the flood rose, growing as much as ten centimetres a day.[7]',
                    'details' => 'It was sown by broadcasting the seed at the start of the rainy season, and today many of those fields grow a faster-maturing crop after the flood recedes instead.[7] Its long stem sections are hollow and work like snorkels, letting the plant swap gases with the air above the water. Nagoya University scientists found the genes behind it, SNORKEL1 and SNORKEL2: when the plant is under water, the gas ethylene builds up and switches them on, and they make the stems grow.[8] Zhou Daguan described something similar at Angkor in 1296: rice that grew without being sown and rose with the water.[9]',
                ],
                [
                    'icon' => '🧪',
                    'title' => 'Reading the rice genome',
                    'text' => 'In 2005 an international team published a finished, map-based sequence of the rice genome and identified 37,544 genes.[10]',
                    'details' => 'Cereal grasses arrange their genes along their chromosomes in very similar ways, so knowing the rice genome also helps breeders improve wheat, sorghum and maize.[10]',
                ],
            ],
            'quiz' => [
                $this->question('Which wild plant is cultivated rice descended from?', ['Oryza rufipogon, a wild rice', 'Wild wheat', 'Bamboo', 'Sugarcane'], 'A 2012 study of more than 1,500 rice genomes traced cultivated rice to the wild rice Oryza rufipogon, first domesticated in southern China.'),
                $this->question('Which compound is linked to the scent of jasmine and basmati rice?', ['2-acetyl-1-pyrroline (2AP)', 'Vanillin', 'Caffeine', 'Chlorophyll'], 'Fragrant rices carry a broken copy of the BAD2 gene, and their scent is linked to 2AP.'),
                $this->question('Why is sticky rice sticky?', ['It lacks amylose, because of a mutation in the Waxy gene', 'It is cooked with sugar', 'It is harvested before it ripens', 'It grows in deeper water'], 'The Waxy mutation stops the plant making amylose, and the missing starch makes the grains sticky.'),
                $this->question('What tells photoperiod-sensitive rice when to flower?', ['The length of the night', 'The temperature of the water', 'The size of the plant', 'The number of tillers'], 'Rice is a short-day plant: longer nights push it to flower, so photoperiod-sensitive rice flowers at about the same time each year.'),
                $this->question('How fast could floating rice around Tonle Sap Lake grow as the flood rose?', ['Up to ten centimetres a day', 'About a millimetre a day', 'About a metre a day', 'It didn\'t grow; it floated loose'], 'Its stems could stretch up to five metres, growing as much as ten centimetres a day.'),
                $this->question('About how many genes did the finished rice genome of 2005 identify?', ['About 37,500', 'About 2,500', 'About a million', 'About 450'], 'The international team identified 37,544 genes.'),
            ],
            'sources' => [
                ['title' => 'New study constructs a map of rice genome variation and origin of cultivated rice', 'publisher' => 'Chinese Academy of Sciences, on Huang et al., Nature (2012)', 'url' => 'https://cemps.cas.cn/kyjz/kyjz2012/201407/t20140721_5172912.html'],
                ['title' => 'The gene for fragrance in rice', 'publisher' => 'Bradbury, Fitzgerald, Henry, Jin and Waters, Plant Biotechnology Journal 3(3), 2005 (Southern Cross University)', 'url' => 'https://researchportal.scu.edu.au/esploro/outputs/journalArticle/The-gene-for-fragrance-in-rice/991012821815802368'],
                ['title' => 'Cambodia\'s jasmine rice variety selected as the World\'s Best Rice', 'publisher' => 'Rice Today, International Rice Research Institute (IRRI)', 'url' => 'https://ricetoday.irri.org/cambodias-jasmine-rice-variety-selected-as-the-worlds-best-rice'],
                ['title' => 'NC State geneticists study origin, evolution of "sticky" rice', 'publisher' => 'North Carolina State University, via ScienceDaily (October 2002)', 'url' => 'https://www.sciencedaily.com/releases/2002/10/021023064638.htm'],
                ['title' => 'Photoperiodism', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Photoperiodism'],
                ['title' => 'Growth performance of photoperiod-sensitive rice (Oryza sativa L.) varieties in different soil types under rainfed condition in Cambodia', 'publisher' => 'Uch, Roeurn, Ro, Kano-Nakata, Yamauchi and Ehara, Agriculture 13(8), 2023', 'url' => 'https://www.mdpi.com/2077-0472/13/8/1602'],
                ['title' => 'Traditional use and availability of aquatic biodiversity in rice-based ecosystems: Kampong Thom Province, Cambodia', 'publisher' => 'T. & P. Balzer with S. Pon, FAO and the Mekong River Commission', 'url' => 'https://www.fao.org/fishery/docs/CDrom/AwarnessAgrBiodiv/Kampong%20thom%20reportA.pdf'],
                ['title' => 'Snorkeling rice: the SNORKEL genes of deepwater rice', 'publisher' => 'Nagoya University research highlight (2010), on Hattori et al., Nature (2009)', 'url' => 'https://en.nagoya-u.ac.jp/news/articles/aip_highlights_009/'],
                ['title' => '真臘風土記 (The Customs of Cambodia), original Chinese text, section 耕種 (Farming)', 'publisher' => 'Chinese Wikisource', 'url' => 'https://zh.wikisource.org/zh-hant/%E7%9C%9F%E8%87%98%E9%A2%A8%E5%9C%9F%E8%A8%98'],
                ['title' => 'International team presents finished sequence of rice genome', 'publisher' => 'Brookhaven National Laboratory (August 2005)', 'url' => 'https://www.bnl.gov/newsroom/news.php?a=110356'],
            ],
        ];
    }

    private function riceHistory(): array
    {
        return [
            'slug' => 'history-of-khmer-rice',
            'title' => 'Two Thousand Years of Khmer Rice',
            'summary' => 'From the river kingdom of Funan and the reservoirs of Angkor to the Khmer Rouge and today\'s prize-winning jasmine rice.',
            'body' => "Rice has fed the people of Cambodia for as long as there are written records of them. Here is that story, one chapter at a time.\n\nFollow the numbers to the sources.",
            'layout' => 'cards',
            'level' => 'beginner',
            'items' => [
                [
                    'icon' => '🏺',
                    'title' => 'Funan: rice on the Mekong (1st–6th centuries)',
                    'text' => 'Cambodia\'s earliest known kingdom grew up along the rivers of the Mekong Delta, a natural home for rice farming and fishing.[1]',
                    'details' => 'A Chinese account from around 245 CE describes Funan\'s "walled villages, palaces, and dwellings" and says its people "devote themselves to agriculture". Funan also stored and channelled water for its fields.[1] The Royal Ploughing rite is traced back to this period: a 6th-century statue of Balarama, the Hindu god who carries a plough, was found at Angkor Borei.[2]',
                ],
                [
                    'icon' => '🛕',
                    'title' => 'Angkor: an empire built on water (9th–15th centuries)',
                    'text' => 'Angkor\'s kings dug huge reservoirs called barays, with temples on islands at their centres.[3]',
                    'details' => 'For decades archaeologists argued over what the barays were for. Bernard-Philippe Groslier saw Angkor as a "hydraulic city" that watered its rice fields from them. The engineer van Liere answered that "not a drop of water ever left the barays to feed the growing rice", and others saw them as mainly religious.[3] Mapping published in 2007 showed a vast, low-density city tied together by a water-management network covering more than 1,000 km².[4] Many researchers now think the reservoirs did both jobs: a stage for the god-kings and water for the fields.[3]',
                ],
                [
                    'icon' => '📜',
                    'title' => 'A Chinese envoy\'s report (1296–97)',
                    'text' => 'Zhou Daguan, who stayed at Angkor with a Chinese embassy from 1296 to 1297, wrote that crops there could be sown and harvested three or four times a year.[5][6]',
                    'details' => 'His book, The Customs of Cambodia (真臘風土記), is a rare first-hand description of the Angkor empire.[5] Its farming section opens: 大抵一歲中，可三四番收種, roughly "in general, crops can be sown and harvested three or four times in a year", because every season is like China\'s fifth and sixth months and frost and snow are unknown. Zhou also saw farmers work out how high the floodwater would be when their rice ripened and sow to match, plough without oxen, and grow a rice that sprang up unsown and rose with the water, "probably another kind" of rice.[6]',
                ],
                [
                    'icon' => '🚂',
                    'title' => 'A rice-exporting nation (1950s–60s)',
                    'text' => 'After independence, rice production rose from about 1.4 million tonnes in 1955 to 2.4 million in 1960.[7]',
                    'details' => 'Yields stayed low, under 1.2 tonnes per hectare from 1952 to 1969, though Battambang and Kampong Cham, with richer soils, harvested about half as much again as the national average. Cambodia was an important rice exporter, and after trade was nationalised in 1963 a large share of the crop, perhaps as much as two-thirds, was smuggled to Vietnam.[7]',
                ],
                [
                    'icon' => '⚠️',
                    'title' => 'Khmer Rouge: "three tonnes per hectare" (1975–79)',
                    'text' => 'In 1976 the Khmer Rouge ordered an average of three tonnes of rice per hectare across the whole country.[8]',
                    'details' => 'Their first Four-Year Plan collectivised property and pushed rice farming, aiming in effect to squeeze an extra harvest out of every year. Three tonnes per hectare was far more than Cambodia had ever produced: in the 1950s and 60s yields had stayed under 1.2 tonnes.[8][7] By some estimates, between 500,000 and 1.5 million of the deaths between 1975 and 1979 were caused by famine.[8]',
                ],
                [
                    'icon' => '🎉',
                    'title' => 'Reviving a harvest festival',
                    'text' => 'After the Khmer Rouge years and decades of civil war, the village of O\'Thmaa brought back its harvest ritual and festival, Bon Dalien.[9]',
                    'details' => 'Anthropologist Eve Zucker studied the revival in 2006. She describes villagers making "tentative and at times ambiguous efforts to connect to their pre-Khmer Rouge past", and using the festival to recreate "a sense of community and moral order".[9]',
                ],
                [
                    'icon' => '🏆',
                    'title' => 'Today: the world\'s best rice',
                    'text' => 'Phka Rumduol, a jasmine rice released by Cambodia\'s CARDI in 1999, was first named World\'s Best Rice in 2012.[10]',
                    'details' => 'Cambodia exported 575,562 tonnes of milled rice to 67 countries between January and November 2024, according to the Cambodia Rice Federation.[11] The Fun Facts lesson in the Rice in Cambodia topic lists every award.',
                ],
            ],
            'quiz' => [
                $this->question('What did Angkor\'s kings dig, with temples on islands at their centres?', ['Huge reservoirs called barays', 'Gold mines', 'Underground tunnels', 'Fish ponds'], 'For decades researchers argued over whether the barays watered rice fields or were mainly religious. Many now think they did both.'),
                $this->question('Zhou Daguan, a Chinese envoy at Angkor in 1296–97, wrote that crops there could be harvested…', ['Three or four times a year', 'Once a year', 'Once every two years', 'Every month'], 'He explained that every season there is like China\'s fifth and sixth months, and frost and snow are unknown.'),
                $this->question('In which year did CARDI release the jasmine rice Phka Rumduol?', ['1999', '1955', '1979', '2012'], 'It was first named World\'s Best Rice in 2012.'),
            ],
            'sources' => [
                ['title' => 'Funan', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Funan'],
                ['title' => 'Royal Ploughing Ceremony', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Royal_Ploughing_Ceremony'],
                ['title' => 'Water, ritual and function', 'publisher' => 'Charles Higham, World Archaeology issue 57 (2013)', 'url' => 'https://www.world-archaeology.com/issues/issue-57/charles-higham-water-ritual-and-function/'],
                ['title' => 'A comprehensive archaeological map of the world\'s largest preindustrial settlement complex at Angkor, Cambodia', 'publisher' => 'Evans et al., Proceedings of the National Academy of Sciences (2007)', 'url' => 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1964867'],
                ['title' => 'Zhou Daguan', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Zhou_Daguan'],
                ['title' => '真臘風土記 (The Customs of Cambodia), original Chinese text, section 耕種 (Farming)', 'publisher' => 'Chinese Wikisource', 'url' => 'https://zh.wikisource.org/zh-hant/%E7%9C%9F%E8%87%98%E9%A2%A8%E5%9C%9F%E8%A8%98'],
                ['title' => 'Economic history of Cambodia', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Economic_history_of_Cambodia'],
                ['title' => 'Forced Labor and Collectivization', 'publisher' => 'United States Holocaust Memorial Museum', 'url' => 'https://www.ushmm.org/genocide-prevention/countries/cambodia/forced-labor-and-collectivization'],
                ['title' => 'Transcending Time and Terror: The Re-emergence of Bon Dalien after Pol Pot and Thirty Years of Civil War', 'publisher' => 'Eve Monique Zucker, Journal of Southeast Asian Studies 37(3), 2006', 'url' => 'https://www.cambridge.org/core/journals/journal-of-southeast-asian-studies/article/transcending-time-and-terror-the-reemergence-of-bon-dalien-after-pol-pot-and-thirty-years-of-civil-war/430D313DCA8D1BD7D43DF61158BC016D'],
                ['title' => 'Cambodia\'s jasmine rice variety selected as the World\'s Best Rice', 'publisher' => 'Rice Today, International Rice Research Institute (IRRI)', 'url' => 'https://ricetoday.irri.org/cambodias-jasmine-rice-variety-selected-as-the-worlds-best-rice'],
                ['title' => 'Cambodia nets $1.79 billion from rice exports', 'publisher' => 'Khmer Times via Vietstock (December 2024), citing the Cambodia Rice Federation', 'url' => 'https://en.vietstock.vn/2024/12/cambodia-nets-179-billion-from-rice-exports-114-593548.htm'],
            ],
        ];
    }

    private function riceLore(): array
    {
        return [
            'slug' => 'rice-lore-and-legends',
            'title' => 'Rice Lore from the Old Books',
            'summary' => 'The nineteen souls of a rice plant, Sujata\'s bowl of milk rice, and the books where Khmer folktales and rice rites were written down.',
            'body' => "Much of what we know about rice beliefs comes from folktales, ritual poems and the notebooks of people who wrote down what farmers told them. The stories here are legends and beliefs, not historical fact, and they change from village to village and from country to country.\n\nFollow the numbers to the books and articles each story comes from.",
            'layout' => 'cards',
            'level' => 'intermediate',
            'items' => [
                [
                    'icon' => '✨',
                    'title' => 'Nineteen souls in a rice plant',
                    'text' => 'Khmer tradition holds that a person has nineteen pralung, or vital souls, and that a rice plant has nineteen too.[1]',
                    'details' => 'Pralung are believed to be fragile: they can wander off or be lured away, and then they must be called home. The ritual poem for this is the Hau Pralung ("Calling the Souls"), which some researchers date to the 17th or 18th century. Ashley Thompson translated it into English and French in Calling the Souls (Reyum, 2005), and Ang Choulean\'s Brah Ling (Reyum, 2004) explores the pralung.[1]',
                ],
                [
                    'icon' => '🥣',
                    'title' => 'Sujata\'s bowl of milk rice',
                    'text' => 'In the Buddha\'s life story, a bowl of milk rice marks the turning point on his path to enlightenment.[2]',
                    'details' => 'After years of extreme fasting, the future Buddha, Siddhartha, was close to starving. A woman named Sujata offered him a bowl of milk-rice porridge with the words "May you be successful in obtaining your wishes!"[3] Eating it ended his years of asceticism and opened the way to his enlightenment.[2]',
                ],
                [
                    'icon' => '📖',
                    'title' => 'Folktales written down in 1895',
                    'text' => 'In 1895 Adhémard Leclère, a French official in Cambodia, published Cambodge: Contes et légendes, an early collection of Khmer folktales in French.[4]',
                    'details' => 'Folktales were usually told aloud, not written down, so collections like this one keep them from being lost. Leclère\'s book, with an introduction by the scholar Léon Feer, is free to read on the Internet Archive.[4]',
                ],
                [
                    'icon' => '📚',
                    'title' => 'The Collection of Khmer Legends',
                    'text' => 'Prachum Reuang Preng Khmer (Collection of Khmer Legends) is a Khmer-language series of folktales in several volumes. The first volume alone holds 34 stories.[5]',
                    'details' => 'The volumes can be read free on Khmer Wikisource.[5] Farm life runs through the tales: in one, a poor man taken on by a rich merchant is told his only job is to chase the chickens away from the paddy spread out to dry.[6]',
                ],
                [
                    'icon' => '🔬',
                    'title' => 'Studying the rice rites',
                    'text' => 'Between 1962 and 1969 the anthropologist Éveline Porée-Maspero published a three-volume study of the agrarian rites of Cambodia.[7]',
                    'details' => 'Porée-Maspero (1906–1991) worked for the EFEO and the CNRS and spent many years in Cambodia. Her study, Étude sur les rites agraires des Cambodgiens, describes in detail the rituals of a Khmer farming society that the civil war later put in danger, and researchers still rely on it today.[7]',
                ],
            ],
            'quiz' => [
                $this->question('In Khmer tradition, how many souls (pralung) does a rice plant have?', ['Nineteen', 'One', 'Seven', 'Nine'], 'A person has nineteen pralung too. They can wander off, and the ritual poem Hau Pralung ("Calling the Souls") calls them home.'),
                $this->question('In the Buddha\'s life story, what did Sujata offer the starving Siddhartha?', ['A bowl of milk rice', 'A basket of mangoes', 'A cup of tea', 'A loaf of bread'], 'Eating it ended his years of extreme fasting and opened the way to his enlightenment.'),
            ],
            'sources' => [
                ['title' => 'Spiritual therapy: "Calling the pralung"', 'publisher' => 'Patrick Kersalé, Sounds of Angkor', 'url' => 'https://soundsofangkor.org/english/others-va/calling-the-pralung-va'],
                ['title' => 'Sujata (milkmaid)', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Sujata_(milkmaid)'],
                ['title' => 'Sujata makes an offering of rice-milk', 'publisher' => 'BuddhaNet', 'url' => 'https://www.buddhanet.net/e-learning/buddhism/033bio/'],
                ['title' => 'Cambodge: Contes et légendes (Adhémard Leclère, introduction by Léon Feer, 1895)', 'publisher' => 'Internet Archive', 'url' => 'https://archive.org/details/cambodgecontese01feergoog'],
                ['title' => 'ប្រជុំរឿងព្រេងខ្មែរ ភាគទី១ (Collection of Khmer Legends, volume 1)', 'publisher' => 'Khmer Wikisource', 'url' => 'https://wikisource.org/wiki/%E1%9E%9F%E1%9F%80%E1%9E%9C%E1%9E%97%E1%9F%85%E1%9E%94%E1%9F%92%E1%9E%9A%E1%9E%87%E1%9E%BB%E1%9F%86%E1%9E%9A%E1%9E%BF%E1%9E%84%E1%9E%96%E1%9F%92%E1%9E%9A%E1%9F%81%E1%9E%84%E1%9E%81%E1%9F%92%E1%9E%98%E1%9F%82%E1%9E%9A_%E1%9E%97%E1%9E%B6%E1%9E%82%E1%9E%91%E1%9E%B8%E1%9F%A1'],
                ['title' => 'ប្រជុំរឿងព្រេងខ្មែរ ភាគទី២: រឿងទេវតាសេកសាយ (Collection of Khmer Legends, volume 2)', 'publisher' => 'Khmer Wikisource', 'url' => 'https://wikisource.org/wiki/%E1%9E%94%E1%9F%92%E1%9E%9A%E1%9E%87%E1%9E%BB%E1%9F%86%E1%9E%9A%E1%9E%BF%E1%9E%84%E1%9E%96%E1%9F%92%E1%9E%9A%E1%9F%81%E1%9E%84%E1%9E%81%E1%9F%92%E1%9E%98%E1%9F%82%E1%9E%9A/%E1%9E%97%E1%9E%B6%E1%9E%82%E1%9E%91%E1%9E%B8%E1%9F%A2/6'],
                ['title' => 'Éveline Porée-Maspero', 'publisher' => 'Angkor Database', 'url' => 'https://angkordatabase.asia/authors/eveline-poree-maspero'],
            ],
        ];
    }

    private function riceAndReligion(): array
    {
        return [
            'slug' => 'rice-and-religion',
            'title' => 'Rice, Spirits and Religion',
            'summary' => 'How guardian spirits, Brahman royal rites and Theravada Buddhism each give rice a place, from the Royal Ploughing to Pchum Ben.',
            'body' => "Religion in Cambodia has layers. Most Cambodians are Buddhists, yet many also honour spirits believed to live in the land and in all kinds of things, and some royal rites come from Brahmanism, the Hindu tradition of ancient India.[1][2] Rice connects all three: it is offered to spirits, blessed in Brahman rites and given to monks.\n\nThe beliefs here are described as people hold them, not as proven fact.",
            'layout' => 'cards',
            'level' => 'intermediate',
            'items' => [
                [
                    'icon' => '🌳',
                    'title' => 'Neak ta: spirits of the land',
                    'text' => 'Neak ta are the guardian spirits of a village and its land. Villagers ask them for rain before the rice is planted.[1]',
                    'details' => 'In Phum Boeung, about 25 km north-west of Phnom Penh, villagers have held the "He Neak Ta" ritual every year for several hundred years. It comes at the start of the monsoon, as farmers prepare to plant rice, a crop that needs a great deal of water, and villagers pray for rain and good fortune. The Associated Press notes that although most Cambodians are Buddhist, the ritual reflects a widespread belief that spirits can live in all kinds of living and non-living things.[1]',
                ],
                [
                    'icon' => '🐂',
                    'title' => 'Brahmanism: the Royal Ploughing',
                    'text' => 'Each year, around May, the Royal Ploughing Ceremony opens the rice-planting season, and the royal oxen forecast the harvest.[2][3]',
                    'details' => 'Stand-ins for the king and queen, the Sdach Meakh and the Preah Mehuo, receive blessings from the Baku, the royal Brahmins, before the ploughing begins.[4] Then the oxen are led to seven trays: rice, corn, beans, sesame, grass, water and rice wine.[5] Court astrologers and Brahmins read the season ahead from what they eat.[3] Choosing water and grass is said to promise enough water and food, and rice wine good business. Buddhist monks chant blessings over the seeds and oxen, so one ceremony joins Brahman, Hindu, Buddhist and animist beliefs.[2]',
                ],
                [
                    'icon' => '🍙',
                    'title' => 'Pchum Ben: rice balls for the dead',
                    'text' => 'Pchum Ben, a 15-day Buddhist festival in September or October, is named after the rice balls offered for the spirits of the dead.[6]',
                    'details' => 'Pchum means "gathering" and ben means "rice balls". It is believed that the gates of hell open at this time, so spirits can receive offerings from their living relatives. Families bring rice balls (bay ben) and sticky-rice cakes (num ansom) to the pagoda, and at some pagodas rice balls are thrown into the air or rice is scattered in empty fields for the dead. Food given to the monks is an act of merit that passes to the ancestors.[6]',
                ],
                [
                    'icon' => '🌕',
                    'title' => 'Ambok: new rice for the moon',
                    'text' => 'At the Water Festival in November, families offer and share ambok, flattened rice made from the new harvest.[7][8]',
                    'details' => 'At the start of the harvest some rice is set aside for it. The grains are fried in their husks, pounded soft and flat in a mortar, and mixed with banana and coconut.[7][8] Ambok is served at Sampeah Preah Khe, the salutation to the moon, when offerings are made to the moon with prayers for peace and prosperity.[7][8]',
                ],
                [
                    'icon' => '🪢',
                    'title' => 'Tug-of-war for the harvest',
                    'text' => 'Teanh praot, the Khmer tug-of-war played at Khmer New Year, is one of the rice-farming "tugging rituals and games" that UNESCO inscribed in 2015.[9][10]',
                    'details' => 'Cambodia, the Philippines, South Korea and Vietnam nominated the tradition together. UNESCO describes these games as played to ensure abundant harvests and prosperity, and as symbols of natural forces such as the sun and rain. Many have deep religious meaning and are held in front of a communal house or shrine, after rites to local protective spirits.[9]',
                ],
            ],
            'quiz' => [
                $this->question('What are neak ta?', ['Guardian spirits of a village and its land', 'Royal astrologers', 'Rice-planting songs', 'Temple musicians'], 'Villagers ask them for rain before the rice is planted.'),
                $this->question('Pchum Ben is named after which offering for the spirits of the dead?', ['Rice balls', 'Candles', 'Lotus flowers', 'Incense sticks'], 'Pchum means "gathering" and ben means "rice balls". Families bring them to the pagoda during the 15-day festival.'),
                $this->question('How is ambok, the Water Festival treat, made?', ['New rice fried in its husk and pounded flat', 'Old rice boiled into porridge', 'Rice flour rolled into noodles', 'Sticky rice roasted in bamboo'], 'Some rice is set aside at the start of the harvest. It is fried in its husks, pounded soft and flat, mixed with banana and coconut, and offered to the moon.'),
                $this->question('Which Khmer New Year game is part of the rice-farming traditions UNESCO inscribed in 2015?', ['Tug-of-war (teanh praot)', 'Kite flying', 'Boat racing', 'Khmer chess'], 'Cambodia, the Philippines, South Korea and Vietnam nominated these "tugging rituals and games" together. They are played to ensure abundant harvests.'),
            ],
            'sources' => [
                ['title' => 'Cambodian villagers honor guardian spirits to pray for rain and good fortune', 'publisher' => 'Associated Press, via Arab News (May 2026)', 'url' => 'https://www.arabnews.com/node/2644414/offbeat'],
                ['title' => 'Cambodia & Tradition: All you need to know about the Royal Sacred Ploughing Ceremony', 'publisher' => 'CambodgeMag (May 2025)', 'url' => 'https://www.cambodgemag.com/en/post/cambodia-tradition-all-you-need-to-know-about-the-royal-sacred-ploughing-ceremony'],
                ['title' => 'Royal Ploughing Ceremony', 'publisher' => 'Wikipedia', 'url' => 'https://en.wikipedia.org/wiki/Royal_Ploughing_Ceremony'],
                ['title' => 'The Royal Ploughing Day (continued)', 'publisher' => 'Official website of King Norodom Sihamoni (May 2009)', 'url' => 'https://norodomsihamoni.org/en/news/2009-05-12_2'],
                ['title' => 'Royal Oxen Ploughing Ceremony Predicts Bumper Rice Harvest', 'publisher' => 'VOA Khmer', 'url' => 'https://khmer.voanews.com/a/royal-oxen-ploughing-ceremony-predicts-bumper-rice-harvest/4928456.html'],
                ['title' => 'A guide to Cambodia\'s Pchum Ben: Ancestors Day', 'publisher' => 'Hello Angkor', 'url' => 'https://helloangkor.com/events-festivals-and-holidays/pchum-ben/'],
                ['title' => 'Rice flattening', 'publisher' => 'Visit Banteay Chhmar (community-based tourism)', 'url' => 'https://www.visitbanteaychhmar.org/visitor-activities/rice-flattening/'],
                ['title' => 'Cambodia gastronomy: the culinary richness of the Water Festival', 'publisher' => 'CambodgeMag (February 2025)', 'url' => 'https://cambodgemag.com/en/post/cambodia-gastronomy-the-culinary-richness-of-the-water-festival'],
                ['title' => 'Decision 10.COM 10.B.12: Tugging rituals and games', 'publisher' => 'UNESCO Intangible Cultural Heritage (2015)', 'url' => 'https://ich.unesco.org/en/decisions/10.COM/10.B.12'],
                ['title' => 'Tugging rituals and games', 'publisher' => 'IntoCambodia', 'url' => 'https://intocambodia.org/content/tugging-rituals-and-games'],
            ],
        ];
    }
}

# GenAI Guardian — Project Overview

> A fully offline edge AI system for telecom fraud detection

---

## 1. What Is GenAI Guardian

GenAI Guardian is a special fraud detection edge AI system that operates **completely offline**.

**No internet connection is required whatsoever. Voice and video data never leave the device.**

Elderly individuals receive phone calls at home — telecom fraud strikes in this most private of spaces. If a system introduces cameras and microphones into that space while transmitting data externally, neither the user nor their family can feel at ease. No matter how much one explains that "the data is encrypted" or "the server is secure," anxiety persists as long as a communication pathway exists. GenAI Guardian resolves this problem through a design that simply does not require any communication pathway. Furthermore, the system is linked to the telephone and **activates only when a call is in progress**. There is no constant surveillance.

| Design Principle | Details |
|---------|------|
| Communication | **Not required. Fully offline operation** |
| Data Transmission | **None. Voice and video data never leave the device** |
| Activation | **Phone-linked. Active only during calls (no constant surveillance)** |
| Hardware | Compact camera (with microphone and speaker) + dedicated compact device |
| Privacy | Non-intrusive. Does not record or accumulate data from the user's daily life |

For deployment in elderly households, neither the availability of an internet connection nor communication costs pose a barrier.

By fusing insights from criminal psychology with AI technology, the system detects the "structure of psychological manipulation" used by fraud perpetrators in real time, through both the conversational context of call audio and behavioral patterns captured on camera.

| Pillar | Function | Characteristics |
|---|------|------|
| **Context Token Detection** | Real-time contextual analysis of call audio | Purpose-built for fraud prevention. Context-aware |
| **Human Behavior Analysis** | Detection of behavioral changes under duress | On-device AI-based motion recognition |
| **Data Foundation** | Multilingual, multi-regional anti-fraud data | Approx. 600 hours of audio, approx. 4 billion characters of text |

---

## 2. The Social Problem: Escalating Telecom Fraud

### The Situation in Japan

| Year | Reported Cases | Damage Amount | Source |
|----|---------|--------|------|
| 2024 | 21,043 cases | 71.76 billion yen | National Police Agency |
| 2025 | 27,758 cases (+31.9%) | **141.4 billion yen** (all-time high) | National Police Agency |

In 2025, telecom fraud damages surged to **roughly double the previous year**, setting a new all-time record (National Police Agency). Including SNS-based investment fraud and romance scams, total damages exceeded **324.1 billion yen**.

### A Growing Global Threat

This problem is not limited to Japan. In January 2026, U.S. anti-fraud expert Frank McKenna stated in his annual report (*2026 Fraud Predictions*) that AI-driven fraud has entered an **"era without guardrails."**

- Global fraud losses exceeded **$1 trillion** in 2025
- Deepfake attacks increased **3,000%** year-over-year
- Approximately **70%** of adults worldwide have experienced some form of fraud
- AI automation is giving rise to "fraud factories" capable of targeting tens of thousands of people daily with minimal staff

The evolution of AI is making fraud techniques more sophisticated by the day. Countermeasures must also evolve through AI.

### The Structure of Elderly Victimization

According to 2024 statistics, **65.4% of telecom fraud victims are aged 65 or older** (National Police Agency). While this figure was 86.6% in 2022 and victimization has been expanding to younger demographics in recent years, the elderly remain at the center of the problem.

Japan has the most aged society in the world, and the elderly population is projected to continue growing. The structural risk of telecom fraud is on a demographic trajectory of expansion.

![Image depicting telecom fraud](/images/04e_antifraud_oreore_en.png)

### Limitations of Existing Countermeasures

Current primary countermeasures — awareness campaigns, nuisance call filters, and call recording — either intervene only **after a call has already begun** or rely on the victim's own judgment.

However, fraud perpetrators succeed precisely by overriding victims' judgment. If a victim were capable of thinking "this might be a scam," the fraud would not succeed in the first place. What is needed is **a system capable of detecting when a person has lost the capacity for sound judgment**.

---

## 3. Established Institutional Attention to This Challenge

### Anti-Fraud Measures Through AI and Criminal Psychology

Anti-fraud approaches that fuse AI with criminal psychology have already attracted significant attention in Japanese society.

Fujitsu Limited, Toyo University, and the city of Amagasaki in Hyogo Prefecture have been conducting joint research since 2022, pursuing telecom fraud prevention through **"converging technology."** In May 2025, they achieved a fraud detection accuracy of **82%**, which was covered by major Japanese media outlets.

| Date | Milestone |
|------|-------------|
| March 2022 | Joint research launched. First field trial (Amagasaki City Hall) |
| September 2022 | Identified 11 factors related to victims' psychological states. Presented at the Japanese Association of Applied Psychology |
| October 2023 | "Converging Technology Research Group" adopted at the Japanese Psychological Association |
| November 2023 | Developed a generative AI-based telecom fraud training tool. Held experience sessions in Amagasaki |
| November 2024 | Deployed devices in 22 elderly households for validation in daily living environments |
| May 2025 | Achieved fraud detection accuracy of **82%** |

This initiative has been officially communicated through multiple channels — Fujitsu, universities, municipalities, and national newspapers.

- [Yomiuri Shimbun — AI Detection Exceeds 80% (May 2025)](https://www.yomiuri.co.jp/national/20250515-OYT1T50201/)
- [Sankei Shimbun — AI Analysis of Respiration and Heart Rate Exceeds 80% (May 2025)](https://www.sankei.com/article/20250515-7JW3P6LQNFLTPDYIF5HDN24R4A/)
- [Fujitsu Official Press Release (September 2022)](https://info.archives.global.fujitsu/jp/news/updatesfj/2022/09/16-1.html)
- [Fujitsu PR — Anti-Fraud AI Training Tool](https://note.com/fujitsu_pr/n/n092c5ae19dbe)
- [Fujitsu Converging Technology Research Group](https://global.fujitsu/ja-jp/local/blog/article/2024-01-19-01)
- [Amagasaki City Official Page](https://www.city.amagasaki.hyogo.jp/kurashi/ansin/bouhan/1030308.html)

### Relevance to GenAI Guardian

The Toyo University professor leading this research was the academic supervisor of the GenAI Guardian researcher during their master's program. The researcher has also participated in the Converging Technology Research Group, attending research presentations and contributing to discussions.

GenAI Guardian addresses the same social challenge through a different approach.

| Comparison | Fujitsu Joint Research | GenAI Guardian |
|--------|-------------|----------------|
| Detection Method | Millimeter-wave sensors + physiological responses | Context Token Detection + Human Behavior Analysis |
| Focus | Hardware sensing | Software / Edge AI |
| Device | Dedicated sensor installation | General-purpose camera + compact device |
| Communication | — | **Fully offline** |
| Shared Philosophy | Non-intrusive, privacy-preserving | Same |

As different research trajectories toward the same goal, there is **potential for mutual complementarity**.

---

## 4. Approach

### 4.1 Context-Based Token Detection — How It Differs from Conventional Methods

The system analyzes call audio in real time to assess the likelihood of fraud.

Conventional keyword-based systems trigger an alert when specific words such as "money," "transfer," or "police" appear. However, these words are also used frequently in everyday conversation. The result is a flood of false positives, causing users to ignore alerts altogether.

GenAI Guardian takes a fundamentally different approach.

- Rather than individual words, it **reads the entire flow of conversation as context**
- It determines whether **a pattern of psychological manipulation is present in the conversation** — the elicitation of fear, the creation of time pressure, the inducement of social isolation
- It does not react merely because a specific word appears. Detection occurs only when those words are embedded within a manipulative context

This **context awareness** suppresses the false positive problem at a fundamental level.

### 4.2 Human Behavior Analysis Under Duress — Why It Is Especially Effective for the Elderly

On-device AI analysis of camera footage detects behavioral changes in the victim during a call.

It is well established that when humans are psychologically cornered — experiencing fear, anxiety, or confusion — they exhibit specific behavioral patterns: restless movements, repetitive actions, unusual changes in posture, and so on.

This detection is particularly effective for elderly individuals. Because the range of movement variation in daily life is smaller for the elderly compared to younger people, **any deviation stands out more sharply, inherently increasing detection reliability**.

All video analysis is processed by on-device AI, and no video data is transmitted externally.

---

## 5. Researcher Background

### Practical Experience in Criminal Courts

Prior to coming to Japan, the researcher spent over two years working in criminal courts in China.

During this period, the researcher was involved in the trial and sentencing of a **large-scale telecom fraud case** that shook the entire country and extended into Southeast Asia. While a typical criminal verdict runs 4 to 6 pages, the verdict for this case exceeded **30 pages**.

All information handled in criminal courts is subject to strict confidentiality obligations, with the exception of the final verdict. Through this experience, the researcher gained an understanding of the psychology, methods, and organizational structures of fraud from within the judicial process.

### Academic Research

In 2021, the researcher's master's thesis focused on **"The Relationship Between Anxiety and Vulnerability to Fraudulent Business Practices and Scams."** From the perspective of criminal psychology, the research analyzed the structure of human vulnerability to fraud victimization.

### Experience Living in Japan

The researcher has lived in Japan for **over 10 years**. Capable of conducting research and professional work in Japanese, the researcher's understanding of Japanese social structures, the realities of population aging, and telecom fraud victimization patterns has been cultivated through long-term residence.

---

## 6. Data Assets

### Aggregate Metrics

| Metric | Value |
|------|------|
| Number of Datasets | 30 |
| Total Recorded Audio | Approx. 600 hours (equivalent to about 1 month of continuous listening) |
| Total Text Volume | Approx. 4 billion+ characters (equivalent to approx. 40,000 books) |
| Languages Covered | Japanese, Chinese, English, Korean (4 languages) |
| Geographic Coverage | Japan, China, United States, South Korea, International (5 countries/regions) |
| Data Period | 2015 – 2025 (approx. 10 years; core period: 2022–2025) |

### Dataset Inventory by Category

| # | Source Type | Region | Language | Scale | Summary |
|---|----------|------|------|------|------|
| 1 | Joint research with a major telecom carrier | China | Chinese | 200+ hours + hundreds of millions of characters | Call audio and transcribed text |
| 2 | Same as above (text-focused) | China | Chinese | Tens of millions of characters | Text classification data |
| 3 | English-language fraud call recordings (research use) | U.S./International | English | 200+ hours + hundreds of millions of characters | Call recordings with research labels |
| 4 | U.S. federal government agency | U.S. | English | Tens of hours | Public record data |
| 5 | Major semiconductor company | International | English | Tens of hours | Voice evaluation data |
| 6 | Actual correspondence with fraud perpetrators | International | English | Hundreds of messages / tens of millions of characters | Primary source material accumulated over years |
| 7 | Japanese law enforcement agencies (5 agencies) | Various regions in Japan | Japanese | Several hours + tens of thousands of characters | Multi-format data from law enforcement sources |
| 8 | AI safety research (4 major tech companies) | International | English | 2 billion+ characters | Safety evaluation data |
| 9 | South Korean academic research | South Korea | Korean | Hundreds of millions of characters | Academic research data |
| 10 | Voice security research | China/International | Chinese/English | Hundreds of millions of characters | Voice security research data |
| 11 | Deepfake detection | International | English | Millions of characters | Detection research materials |

These datasets were systematically collected through years of investigation and relationship-building with law enforcement agencies and research institutions across multiple countries. Some data was obtained through investigative activities that involved personal risk.

> Detailed information about the data assets can be presented in a controlled environment upon inquiry.

### Data Statistics Dashboard

![GenAI Guardian Data Asset Statistics](/images/05_guardian_dashboard_en.png)

### Data Type Statistics

![Data Type Statistics](/images/07_guardian_stats.png)

> File type analysis conducted on the same workstation. Audio data: 36,962 files / 33.5 GB. Text data: 57,428 files / 9.1 GB. Total: 108,105 files / 55.5 GB.

---

## 7. Future Outlook

GenAI Guardian's starting point is protecting Japan's elderly from telecom fraud.

However, the system's detection target is not a specific set of fraud techniques but rather **the structure of psychological manipulation through language** itself. Tokens are the smallest building blocks of both human language and AI language processing — whether text is generated by AI or spoken by a human, it is all processed as sequences of tokens.

By its very nature, context-based Token detection can extend its scope of application in the following directions.

| Phase | Target |
|---------|------|
| Present | Detection of elderly telecom fraud (Japanese market) |
| Near-term | Safety screening of AI-generated content; trust verification for digital humans and live streaming |
| Long-term | Multilingual expansion. As AI becomes more involved in communication, the applicability of context Token detection expands accordingly |

---

## 8. Contact

Zichao Zhou
zxvchaos@gmail.com

---

*GenAI Guardian — Project Overview*
*2026-03*

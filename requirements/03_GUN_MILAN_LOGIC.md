# Gun Milan (Ashtakoot) Calculation Logic — Updated

## Why this update

The classical Ashtakoot (36-guna) system is computed purely from each person's
**Rashi (Moon sign)** and **Nakshatra (with Charan/Pada)**. Lagna is not one of
the inputs to the 36-point koot calculation — it was previously used only as a
shortcut to guess Manglik status from Mars's house position, which is not a
reliable substitute for a full Manglik reading (that needs exact planetary
degrees and aspects — Jupiter/Saturn/Rahu aspects on Mars, Venus's position,
etc.). This version corrects that.

- **Removed:** Lagna (Ascendant), and the Mars-house-from-Lagna /
  Mars-house-from-Moon fields.
- **Nakshatra** is now the anchor identity field in place of Lagna.
- **Added Gana** — stated directly, as it would appear on a real biodata,
  and cross-checked against the value that Nakshatra determines.
- **Added Gotra** — powers a separate **Sagotra check**: a same-Gotra
  alliance is treated as prohibited in most communities, regardless of
  the numeric score.
- **Manglik status is now a stated input** — taken from each person's own
  astrologer/kundli reading — rather than derived in-app from a simplified
  house count.

---

## 1. Inputs Required (per person)

| Field (Marathi / English) | Example | Used for |
|---|---|---|
| राशी / Rashi | Kumbha | Varna, Vashya, Graha Maitri, Bhakoot |
| नक्षत्र / Nakshatra | Purva Bhadrapada | Tara, Yoni, Gana, Nadi |
| नक्षत्र चरण / Nakshatra Charan (1–4) | 1 | Yoni (fine-grained cases), display |
| गण / Gana (Deva / Manushya / Rakshasa) | Manushya | Gana Koot — cross-checked against Nakshatra |
| गोत्र / Gotra | Kashyap | Sagotra check (pass/fail, separate from the 36 points) |
| मंगळ स्थिती / Manglik Status (Manglik / Non-Manglik / Anshik) | Anshik | Manglik compatibility check (pass/fail, separate from the 36 points) |

**On Gana:** Gana is astrologically fixed by Nakshatra — every one of the 27
Nakshatras has one, unchanging Gana. It's still collected as a stated field
(as it would appear on a biodata) purely so the app can flag a mismatch
between what was stated and what the Nakshatra implies, rather than trusting
either source blindly.

---

## 2. The Eight Koots — Formulas

**1. Varna (1 point)**
Each Rashi maps to a Varna: Brahmin (highest) → Kshatriya → Vaishya →
Shudra (lowest). Score = 1 if the groom's Varna rank is greater than or
equal to the bride's Varna rank, else 0.

**2. Vashya (2 points)**
Each Rashi belongs to one of five Vashya groups (Manav, Chatushpada,
Jalachar, Vanachar, Keeta). Score is read from a fixed 5×5 Vashya
compatibility matrix using the groom's and bride's groups — values range
0 to 2 depending on how the two groups relate (self/friendly/neutral/hostile).

**3. Tara (3 points)**
Count the Nakshatras from the groom's to the bride's (inclusive, wrapping
after 27), then take that count mod 9 (using 9 instead of 0) to get a
"Tara" number 1–9. Repeat in the other direction (bride to groom). Each of
the two Tara numbers is looked up as favorable or unfavorable. Score:
both favorable = 3, one favorable = 1.5, none favorable = 0.

**4. Yoni (4 points)**
Each Nakshatra has one of 14 animal Yonis (e.g., Horse, Elephant, Cat,
Rat). Score is read from a 14×14 Yoni compatibility matrix: same animal
= 4 (best), friendly pair = 3, neutral = 2, enemy pair = 0–1 depending on
the severity of the traditional enmity (e.g., Cat–Rat, Snake–Mongoose are
worst-case = 0).

**5. Graha Maitri (5 points)**
Each Rashi has a ruling planet ("lord"). Score is read from the classical
planetary friendship table (each planet is a friend, neutral, or enemy of
every other) applied to the groom's Rashi-lord vs. the bride's Rashi-lord.
Range: 0 (both lords enemies of each other) to 5 (same lord or mutual
friends).

**6. Gana (6 points)**
Each Nakshatra belongs to one of three Ganas: Deva, Manushya, or Rakshasa.
Score is read from a fixed 3×3 Gana compatibility matrix — same Gana or
Deva-Manushya pairings score highest; Deva-Rakshasa scores lowest (0).

**7. Bhakoot (7 points)**
Count the sign-distance from the groom's Rashi to the bride's Rashi
(1–12, wrapping). Certain distances are considered afflicted
— specifically 2nd/12th, 5th/9th, and 6th/8th positions from each other.
If the distance falls in that afflicted set: score = 0 (Bhakoot Dosha).
Otherwise: score = 7.

**8. Nadi (8 points, all-or-nothing)**
Each Nakshatra belongs to one of three Nadis: Aadi, Madhya, or Antya.
If groom and bride share the same Nadi: score = 0 (Nadi Dosha — considered
the most serious affliction in the whole system). If different: score = 8.

**Total = sum of all eight koots, maximum 36.**

---

## 3. Separate Pass/Fail Checks (outside the 36 points)

**Sagotra check (Gotra):**
If the groom's and bride's Gotra are the same (case-insensitively), flag
**Sagotra Dosha**. This is treated as a hard gate in most communities —
traditionally not permitted regardless of how high the 36-point score is.

**Manglik check:**
Compare the two stated Manglik statuses:
- Both "Manglik" or both "Non-Manglik" → compatible.
- One "Anshik" (partial) paired with the other "Manglik" or "Non-Manglik"
  → generally considered acceptable, but flagged for astrologer review.
- A clear "Manglik" vs. "Non-Manglik" mismatch → flagged as incompatible,
  astrologer review recommended (many traditions hold this can still be
  resolved by remedies, so it's a flag, not an automatic rejection).

---

## 4. Interpreting the Final Result

Apply in this order:

1. **Sagotra Dosha present** → report as prohibited regardless of score;
   stop here.
2. **Nadi Dosha present** (score 0 on Nadi) → report as traditionally
   advised against, regardless of the numeric total.
3. Otherwise, band the numeric total out of 36:
   - 0–18: Below average match
   - 18–24: Average match
   - 24–32: Good match
   - 32–36: Excellent match
4. If **Bhakoot Dosha** is present (and Nadi Dosha is not) → append a note
   recommending astrologer review, without overriding the numeric band.
5. Report the **Manglik check** result alongside the score as its own
   line item — it is never merged into the 36-point total.

---

## 5. Validation Before Production Use

The compatibility tables referenced above (Vashya, Yoni, Graha Maitri,
Gana, Tara, and the Bhakoot afflicted-distance set) are the classical
rules, but transcription errors are easy to introduce. Before trusting
any result:

1. Cross-check every lookup table against a trusted Panchang or published
   Ashtakoot reference.
2. Spot-check results against a trusted Kundali-matching tool or an
   astrologer's manual calculation for a couple of known example charts.
3. Treat Nakshatra Charan, stated Gana, Gotra, and Manglik status as
   inputs that must themselves be verified against each person's actual
   kundli/astrologer reading — as this conversation's earlier corrections
   to your own chart showed, transcription errors are easy to make from
   handwritten source documents.

---

## 6. Downstream Impact

This field change (Lagna removed; Nakshatra, Gana, Gotra, Manglik Status
added/kept as direct inputs) also affects the `astrology` block in
`my_biodata.yaml` (02_DATA_MODEL.md) and the `bride` object in the
`POST /api/match` request (04_API_SPEC.md) — both should drop the
Lagna/Mars-house fields and add `gana`, `gotra`, and `manglik_status`
to stay consistent with this file.
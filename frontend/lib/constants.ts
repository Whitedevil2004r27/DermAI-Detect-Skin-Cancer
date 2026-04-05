import { CancerInfo } from "@/types/prediction";

export const CANCER_INFO: Record<string, CancerInfo> = {
  mel: {
    label: "Melanoma",
    scientific_name: "Malignant Melanoma",
    risk_level: "CRITICAL",
    color: "#FF4D6D",
    description: "The most serious type of skin cancer. It develops in the melanocytes, the cells that produce melanin.",
    prevalence: "11.1% of dataset",
    symptoms: [
      "A change in an existing mole",
      "The development of a new pigmented or unusual-looking growth on your skin",
      "ABCDE rules: Asymmetry, Border irregularity, Color changes, Diameter > 6mm, Evolving shape"
    ],
    treatment: "Surgical excision, sentinel node biopsy, immunotherapy, or targeted therapy.",
    when_to_see_doctor: "Immediately. Early detection is critical for survival."
  },
  bcc: {
    label: "Basal Cell Carcinoma",
    scientific_name: "Basal Cell Carcinoma",
    risk_level: "HIGH",
    color: "#FF8C42",
    description: "A type of skin cancer that begins in the basal cells. It often appears as a slightly transparent bump on the skin.",
    prevalence: "5.1% of dataset",
    symptoms: [
      "A pearly white, skin-colored or pink bump",
      "A flat, scaly, flesh-colored or brown patch",
      "A white, waxy, scar-like lesion"
    ],
    treatment: "Curettage and electrodesiccation, Mohs surgery, or topical medications.",
    when_to_see_doctor: "Within a few weeks of noticing a persistent growth or sore."
  },
  akiec: {
    label: "Actinic Keratosis",
    scientific_name: "Bowen's disease / AK",
    risk_level: "MODERATE",
    color: "#FFD166",
    description: "A rough, scaly patch on the skin that develops from years of sun exposure. It is considered precancerous.",
    prevalence: "3.2% of dataset",
    symptoms: [
      "Rough, dry or scaly patch of skin",
      "Flat to slightly raised patch or bump",
      "Itching, burning, or bleeding"
    ],
    treatment: "Cryotherapy (freezing), laser therapy, or topical creams (Efudex).",
    when_to_see_doctor: "If patches become inflammatory, painful, or start to bleed."
  },
  bkl: {
    label: "Benign Keratosis",
    scientific_name: "Seborrheic Keratosis / Solar Lentigines",
    risk_level: "LOW",
    color: "#4CC9F0",
    description: "Noncancerous skin growths that some people get as they age. They often look like 'stuck-on' warts.",
    prevalence: "10.9% of dataset",
    symptoms: [
      "Waxy or 'pasted on' look",
      "Round or oval shape",
      "Tan, brown or black color"
    ],
    treatment: "Usually none required unless irritated. Can be removed for cosmetic reasons.",
    when_to_see_doctor: "If the growth changes rapidly or becomes easily irritated."
  },
  df: {
    label: "Dermatofibroma",
    scientific_name: "Dermatofibroma",
    risk_level: "LOW",
    color: "#4CC9F0",
    description: "Common noncancerous skin growths that usually appear on the lower legs.",
    prevalence: "1.1% of dataset",
    symptoms: [
      "Small, firm, red or brown bump",
      "Dimples inward when pinched",
      "May be itchy or sensitive"
    ],
    treatment: "Usually none. Can be surgically removed.",
    when_to_see_doctor: "If you want it removed or if it becomes painful."
  },
  vasc: {
    label: "Vascular Lesion",
    scientific_name: "Angiomas / Hemangiomas",
    risk_level: "LOW",
    color: "#4CC9F0",
    description: "Birthmarks or skin growths made up of blood vessels. Usually benign.",
    prevalence: "1.4% of dataset",
    symptoms: [
      "Red, purple or blue marks on skin",
      "May be flat or raised",
      "Usually painless"
    ],
    treatment: "Laser surgery or observational monitoring.",
    when_to_see_doctor: "If the lesion bleeds frequently or grows rapidly."
  },
  nv: {
    label: "Melanocytic Nevi",
    scientific_name: "Common Mole",
    risk_level: "BENIGN",
    color: "#00E5A0",
    description: "A common type of skin growth (mole). Most moles are harmless and do not require treatment.",
    prevalence: "66.8% of dataset",
    symptoms: [
      "Small brown spots",
      "Uniform color, surface, and border",
      "Round or oval shape"
    ],
    treatment: "None required.",
    when_to_see_doctor: "Only if the mole starts showing ABCDE changes."
  }
};

export const ISO_CONTROLS = {
  "A.5.1": {
    titleKey: "controls.A_5_1.title",
    descriptionKey: "controls.A_5_1.description",
  },
  "A.5.2": {
    titleKey: "controls.A_5_2.title",
    descriptionKey: "controls.A_5_2.description",
  },
  "A.5.3": {
    titleKey: "controls.A_5_3.title",
    descriptionKey: "controls.A_5_3.description",
  },
} as const;

export function getIsoControl(controlId: string) {
  return ISO_CONTROLS[controlId as keyof typeof ISO_CONTROLS] ?? null;
}
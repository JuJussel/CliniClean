export const useSystemStore = () => {
  const innerStore = defineStore("systemStore", {
    persist: true,
    state: () => ({
      system: null,
      icons: {
        set: "material-symbols-light:tab-group-outline",
        perscription: "material-symbols:pill-outline",
        shot: "material-symbols-light:syringe-outline",
        prevVac: "material-symbols-light:coronavirus-outline",
        op: "material-symbols-light:bed-outline",
        treat: "material-symbols-light:healing-outline",
        exam: "material-symbols:lab-research-outline-rounded",
        xRay: "material-symbols-light:radiology-outline",
        healthCheck: "material-symbols-light:medical-information-outline",
        dashboard: "material-symbols-light:space-dashboard-outline",
        basic: "material-symbols-light:medical-information-outline",
        risk: "material-symbols-light:warning-outline",
        issues: "material-symbols-light:asterisk",
        vitals: "material-symbols-light:vital-signs",
        procedures: "material-symbols-light:list-alt-outline",
        diseases: "material-symbols-light:sick-outline",
        encounter: "material-symbols-light:outpatient-med-outline",
        files: "material-symbols-light:attach-file",
        phone: "fa-solid fa-phone",
        email: "fa-solid fa-envelope",
        work: "fa-solid fa-briefcase",
        home: "fa-solid fa-house",
        mobile: "fa-solid fa-mobile-screen",
        cash: "material-symbols:attach-money",
        creditCard: "material-symbols:credit-card",
        qrPay: "material-symbols:qr-code-2",
      },
    }),
    actions: {
      async getSystemData() {
        try {
          const res = await $fetch("/api/system", {
            method: "GET",
          });
          if (res.success && res.data) {
            this.system = res.data;
          } else {
            console.error("API Error:", res.message);
            this.system = null;
          }
        } catch (e) {
          console.error("System data error:", e);
          this.system = null;
        }
      },
    },
  });

  const store = innerStore();

  if (!store.system) {
    store.getSystemData();
  }
  return store;
};

<template>
  <div>
    <!--Header Layout-->
    <header-layout @onLoggedOut="logOut" @onSubscribed="viewConditions" />
    <!--End Header L.-->

    <!--Main router view-->
    <router-view :key="$route.fullPath" />
    <!--End main router view -->

    <!--Footer view-->
    <footer-layout @onShowPrivacy="viewConditions" />
    <!--End footer view-->

    <!-- otp modal !-->
    <otp-modal @onSubmitted="activateAccount" />
    <!--End otp modal-->

    <!-- privacy modal !-->
    <privacy-modal
      pdfSrc="assets/privacy-policy.pdf"
      @onAccepted="conditionAccepted(true)"
      @onRefused="conditionAccepted(false)"
    />

    <!--Button trigger show privacy modal-->
    <button
      id="btn-privacy"
      data-bs-toggle="modal"
      data-bs-target="#privacyModal"
      class="d-none"
    ></button>
  </div>
</template>

<script>
import $ from "jquery";
import headerLayout from "@/components/layouts/header_layout";
import footerLayout from "@/components/layouts/footer_layout";
export default {
  name: "MainLayout",
  components: {
    headerLayout,
    footerLayout,
  },

  data() {
    return {
      hasMobileMenu: false,
      route: "",
    };
  },
  computed: {
    client() {
      return this.$store.getters.getClient;
    },
  },
  mounted() {
    /**
     * Si le compte est encore en pending , exigez l'activation du compte.
     * */
    if (this.client.client_status === "pending") {
      this.$otpModal("show");
    }

    setInterval(() => {
      this.route = this.$route.path.replaceAll("/", "");
    }, 500);
  },
  methods: {
    openCloseMenu() {
      this.hasMobileMenu = !this.hasMobileMenu;
    },
    logOut() {
      this.$swal
        .fire({
          text: "Etes-vous sûr de vouloir vs déconnecter ?",
          showDenyButton: true,
          showCancelButton: false,
          toast: true,
          icon: "question",
          position: "top-end",
          confirmButtonText: "Oui",
          denyButtonText: "Non",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.$store.dispatch("logOut").then(() => {
              this.$router.replace({
                name: "login",
              });
            });
          }
        });
    },
    viewConditions() {
      /**check if is current route is subscribe**/
      var currentRouteName = this.$route.name;
      if (currentRouteName === "new-loan") {
        this.$swal.fire({
          text: "Vous êtes dans la page de souscription !",
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        return false;
      }

      /**
       * Afficher et faire accepter les termes & conditions.
       */
      $("#btn-privacy").click();
    },
    conditionAccepted(accepted = false) {
      if (!accepted) {
        this.$swal({
          text: "Désolé! Vous ne pouvez pas continuer",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          icon: "warning",
        });
      } else {
        this.$router.push({
          name: "new-loan",
        });
      }
    },
    activateAccount(otp) /** method pour activer un compte */ {
      console.log("dsdaad:" + otp);
      var form = new FormData();
      form.append("client_id", this.client.client_id);
      form.append("otp", otp);

      this.$store.dispatch("activateAccount", form).then((res) => {
        if (res.reponse.status === "success") {
          this.$otpModal("hide");
        } else {
          alert("Code invalide");
        }
      });
    },
  },
};
</script>

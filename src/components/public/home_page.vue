<template>
  <div class="mt-15">
    <!-- content start -->
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="mt-n6 mb-10">
            <loader :data-loaded="loader" height="200">
              <div class="row" v-if="diligences.length > 0">
                <div
                  class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                  v-for="diligence in diligences"
                  :key="diligence.diligence_id"
                >
                  <div class="card mb-6 text-center border-0 smooth-shadow-sm">
                    <span
                      class="badge bg-danger p-2 position-absolute end-0 rounded-0 fs-7 rounded-top-end-2 rounded-bottom-start-2 fw-semi-bold"
                      >status : {{ diligence.diligence_status }}</span
                    >
                    <div class="card-body p-5">
                      <div class="mb-6">
                        <img
                          src="assets/images/icon/icon-2.svg"
                          alt="Icon"
                          class="icon-xxl"
                        />
                      </div>
                      <h3>
                        <a href="javascript:void(0)" class="text-inherit">{{
                          diligence.diligence_type
                        }}</a>
                      </h3>
                      <span>{{ diligence.objet | sortlength(35, "...") }}</span
                      ><br />
                      <span style="font-size: 10px; font-weight: 600">
                        <span class="me-2">
                          <i class="fas fa-calendar text-success me-1"></i
                          >{{ diligence.date_enregistrement.split("|")[0] }}</span
                        >
                        <span class="me-2"
                          ><i class="fas fa-clock text-success me-1"></i
                          >{{ diligence.date_enregistrement.split("|")[1] }}</span
                        ></span
                      ><br />
                      <button
                        @click.prevent="
                          $router.push({
                            name: 'loan-view',
                            params: { id: diligence.diligence_id },
                          })
                        "
                        class="btn btn-sm btn-light mt-3 border-bottom border-primary border-2 fw-bold fs-5"
                      >
                        <i class="fa fa-arrow-right"></i> Voir d??tails diligence
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-md-12 text-center" data-aos="fade-down">
                  <img
                    src="assets/images/folder_1.png"
                    style="width: 100px; height: 100px"
                  />
                  <div class="not_found">
                    <h3>Bienvenu(e) chez Verifixs !</h3>
                    <a
                      href="#/creation/diligence"
                      class="btn btn-danger btn-lg p-3 btn-shadow"
                      @click.prevent="viewConditions"
                    >
                      <i class="lnr lnr-plus-circle mr-2"></i> Postuler maintenant ?? une
                      diligence</a
                    >
                  </div>
                </div>
              </div>
              <div style="display: none" class="row">
                <div class="col-md-12">
                  <div class="text-center">
                    <!-- section title start-->
                    <h1 class="mb-2">
                      <span class="fa fa-warning"></span> Bienvenu(e) chez Verifixs !
                    </h1>
                    <p class="fs-6 text-danger">
                      Veuillez souscrire ?? une ou plusieurs diligences !
                    </p>
                    <div class="btn btn-danger btn-lg" @click.prevent="viewConditions">
                      Postuler ?? une diligence
                    </div>
                  </div>
                </div>
              </div>
            </loader>
          </div>
        </div>
      </div>
    </div>
   
  </div>
  <!-- /.content end -->
</template>

<script>
import loader from "../loader";
import $ from "jquery";
export default {
  components: { loader },
  data() {
    return {
      loader: false,
    };
  },
  computed: {
    diligences() {
      return this.$store.state.diligences;
    },
    client() {
      return this.$store.getters.getClient;
    },
  },
  mounted() {
    var formData = new FormData();
    formData.append("client_id", this.client.client_id);
    this.$store.dispatch("viewDiligences", formData).then(() => {
      this.loader = true;
    });
  },
  methods: {
    viewConditions() {
      /**
       * Afficher et faire accepter les termes & conditions.
       */

      //TODO: Sauter l'affichage des termes & conditions , jusqu'?? ce que le document original des conditions soit pret aupr??s du client.
      $("#btn-privacy").click();
      //this.conditionAccepted(true);
    },
    conditionAccepted(accepted = false) {
      if (!accepted) {
        this.$swal({
          title: "D??sol??! Vous ne pouvez pas continuer",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          icon: "warning",
        });
      } else {
        this.$router.push({ name: "new-loan" });
      }
    },
  },
};
</script>

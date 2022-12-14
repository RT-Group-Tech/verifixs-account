import axios from "axios";
//import { scroller } from "vue-scrollto/src/scrollTo";

const actions = {
    login({ state }, data) /** method pour le login */
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/utilisateurs/connexion/login", data).then(function(result) {
                var data = result.data;
                resolve(data);
            });
        });
    },
    logUserIn({ commit }, data) /** method pour sauvegarder les données d'un user connecté */
    {
        //console.log("Before commit:"); console.log(data);
        commit("setUser", data);
    },
    logUserOut() /** method pour deconnecter un user */
    {
        localStorage.removeItem("user");
    },
    viewDiligences({ state, commit }, data)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/dashboard", data).then(function(result) {
                var data = result.data;

                //console.clear(); console.log(data);
                resolve(data);
                commit("setDiligences", data.data);
            });
        });

    },
    newDiligence({ state, commit }, data)
    {
        return new Promise(function(resolve)
        {
            axios.post(state.baseURL + "/clients/diligences/postuler", data).then(function(result) {
                console.clear();

                resolve(result.data);
            });
        });
    },
    viewDiligenceDetails({ state, commit }, data_sent)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/diligences/view", data_sent).then(function(result) {
                var data = result.data;
                resolve(data);
                var diligences = state.diligences;
                for (var i = 0; i < diligences; i++) {
                    if (diligences[i].diligence_id === data_sent.diligence_id) {
                        diligences[i].details = data.details;
                    }
                }
                //console.clear(); console.log(diligences);
                //commit("setDiligences",diligences);
                commit("setDiligenceDetails", data.details);
            });
        });
    },
    uploadDocument({ state }, data)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/diligences/uploader", data).then(function(result) {
                var data = result.data;

                resolve(data);
            });
        });
    },
    registerAccount({ state, commit }, data)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/connexion/clients/registeraccount", data).then(function(result) {
                var data = result.data;
                resolve(data);

                if (data.reponse !== undefined && data.reponse.status === "success") {
                    commit("setClient", data.reponse.data);
                }
            });
        });
    },
    loginAccount({ state, commit }, data)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/connexion/clients/login", data).then(function(result) {
                var data = result.data;

                resolve(data);
                if (data.reponse !== undefined && data.reponse.status === "success") {
                    commit("setClient", data.reponse.data);
                }
            });
        });
    },
    logOut({ commit })
    {
        commit("setClient", {});
    },
    postulerDiligence({ state }, data)
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/diligences/postuler", data).then(function(result) {
                var data = result.data;

                resolve(data);
            });
        });
    },
    getDiligenceTypes({ state, commit })
    {
        return new Promise(function(resolve) {
            axios.get(state.baseURL + "/config/clients").then(function(result) {
                var data = result.data;

                resolve(data);

                commit("setDiligenceTypes", data.diligence_types);
            });
        });
    },
    repondreQuestion({ state }, data) /** method pour envoyer la réponse d'une question au serveur */
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/diligences/repondrequestion", data).then(function(result) {
                var data = result.data;
                //console.clear(); console.log(data);
                resolve(data);
            });
        });
    },
    payer({ state }, data) /** method pour payer le frais d'une diligence */
    {
        return new Promise(function(resolve) {
            axios.post(state.baseURL + "/clients/diligences/paiements/payer", data).then(function(result) {
                var data = result.data;

                resolve(data);
            });
        });
    },

    /*/
     requete pour afficher les actifs
     /*/
    viewActifs({ state, commit })
    {
        axios.get(`${state.baseURL}/config/actifs`).then((result) => {

            var data=result.data.actifs;

            /**
             * Pour bien gerer les reponses multiples
             */
            for(var i=0; i<data.length; i++)
            {
                var details=data[i].details;
                for(var k=0; k<details.length; k++)
                {
                    if(details[k].reponse_type.includes("multiple"))
                    {
                        data[i].details[k].reponses=[{reponse:""}];
                    }
                }
            }
            commit("setActifs", data);
        })
    },
    enregistrerCredit({state},data) /** method pour enregistrer un crédit */
    {
        return new Promise(function(resolve)
        {
            axios.post(state.baseURL+"/clients/diligences/credits",data).then(function(result)
            {
                var data=result.data;

                resolve(data);
            });
        });
    }
    ,
    activateAccount({state,commit},data) /** method pour activier un compte */
    {
        return new Promise(function(resolve)
        {
            axios.post(state.baseURL+"/clients/account",data).then(function(result){
                var data=result.data;

                console.clear(); console.log(data);
                if(data.reponse.status==="success")
                {
                    /**
                     * Update client dans le store.
                     */
                    commit("setClient",data.reponse.data);
                }
                resolve(data);
            });
        });
    }

};

export default actions;

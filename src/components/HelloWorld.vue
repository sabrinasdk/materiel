<script>
import AddMateriel from './AddMateriel.vue'
import axios from 'axios'


export default {
  name: 'PageMateriels',
  components: {
    AddMateriel


  },
  data() {
    return {
      title: 'Page Materiel',
      materiels: [],
      currentPage: 1,
      itemsPerPage: 150,
      filters: {
        matricule: '',
        code_fam: '',
        libelle: '',
        code_frs: '',
        date_acquisition: '',
        montant: ''
      }
    };
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    fetchMateriels() {
      axios.get('http://localhost:3000/materiel')
        .then(response => {
          this.materiels = response.data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des matériels :', error);
        });
    },
  },
  computed: {

    filteredMateriels() {
      return this.materiels.filter(item => {
        return Object.keys(this.filters).every(key => {
          const filterValue = this.filters[key]?.toString().toLowerCase();
          const itemValue = item[key]?.toString().toLowerCase();
          return filterValue === '' || itemValue.includes(filterValue);
        });
      });
    },
    paginatedMateriels() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMateriels.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredMateriels.length / this.itemsPerPage);
    }
  },

  watch: {
    itemsPerPage() {
      this.currentPage = 1;
    }
  },

  mounted() {
    this.fetchMateriels();
    /* axios.get('http://localhost:3000/materiel')
        .then(response => {
          this.materiels = response.data
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des utilisateurs :', error)
        })
      console.log('Component mounted');*/
  },
};
</script>

<template>

  <!-- You can open the modal using ID.showModal() method -->

  <div class=" mx-auto px-4 ">

    <button class="btn btn-dash btn-primary rounded-none m-2" onclick="my_modal_4.showModal()">Ajouter du nouveaux
      materiels</button>



    <AddMateriel @materiel-ajoute="fetchMateriels" />
    <div class="overflow-x-auto">
      <label for="perPage">Lignes par page :</label>
      <select id="perPage" v-model.number="itemsPerPage">

        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="70">70</option>
        <option :value="100">100</option>
        <option :value="150">150</option>
        <option :value="100">200</option>
      </select>
      <table class="table table-xs table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th><input v-model="filters.matricule" placeholder="Filtrer" class="input input-xs" /></th>
            <th><input v-model="filters.code_fam" placeholder="Filtrer" class="input input-xs" /></th>
            <th><input v-model="filters.libelle" placeholder="Filtrer" class="input input-xs" /></th>
            <th><input v-model="filters.code_frs" placeholder="Filtrer" class="input input-xs" /></th>
            <th><input v-model="filters.date_acquisition" placeholder="AAAA-MM-JJ" class="input input-xs" /></th>
            <th><input v-model="filters.montant" placeholder="Filtrer" class="input input-xs" /></th>
            <th></th>
          </tr>
          <tr>
            <th>#</th>
            <th>Matricule</th>
            <th>Famille</th>
            <th>Désignation</th>
            <th>Fournisseur</th>
            <th>Date Acquisition</th>
            <th>Montant (€)</th>
            <th>Edition</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="(item, index) in paginatedMateriels" :key="item.code_mat">
            <th>{{ index + 1 }}</th>
            <td>{{ item.matricule }}</td>
            <td>{{ item.code_fam }}</td>
            <td>{{ item.libelle }}</td>
            <td>{{ item.code_frs }}</td>
            <td>{{ item.date_acquisition }}</td>
            <td>{{ item.montant }}</td>
            <td></td>
          </tr>
        </tbody>


        <!-- Pagination -->

      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>

        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
          :class="{ active: currentPage === page }">
          {{ page }}
        </button>

        <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.pagination {
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
}

.pagination button.active {
  font-weight: bold;
  background-color: #eee;
}
</style>

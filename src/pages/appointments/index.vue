<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">Visualizar Chamados</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="text-center pa-12">
            <v-icon icon="mdi-calendar-search" size="100" color="grey-lighten-1" />
            <h2 class="text-h5 mt-6 mb-4">Em breve</h2>
            <p class="text-body-1 text-grey">
              Esta página exibirá todos os chamados agendados
            </p>
            <v-btn
              color="primary"
              size="large"
              class="mt-6"
              to="/appointments/new"
            >
              <v-icon icon="mdi-calendar-plus" class="mr-2" />
              Criar Novo Chamado
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  //
</script>

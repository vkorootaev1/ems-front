<template>
    {{ selected }}
    <v-autocomplete v-model="selected" :items="items" v-model:search="search1" outlined dense small-chips
        label="Autocomplete" multiple v-debounce:400="helloPrint">
        <template v-slot:selection="">

        </template>
    </v-autocomplete>
    <button @click="items = ['foo1', 'bar1', 'fizz1', 'buzz1']">
        Изменить
    </button>
    <h3>Выбранные</h3>
    <div v-for="select in selected" :key="select">
        {{ select }}
    </div>
</template>
 
<script>
export default {
    name: 'AttendanceTeacher',

    data: () => ({
        items: ['foo', 'bar', 'fizz', 'buzz'],
        selected: [],
        value: null,
        search1: "",
    }),
    methods: {
        helloPrint() {
            console.log('Я тут')
            console.log(this.search1)
        }
    }
}
</script>
 
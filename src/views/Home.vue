<template>
  <div class="reservation__container">
    <card :multiplier="200">
      <div slot="header">
        <h1 class="reservation__header">{{ question }}</h1>
      </div>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import Card from "@/components/Card.vue";

export default Vue.extend({
  components: {
    Card,
  },
  data: () => {
    return {
      question: null,
    };
  },
  mounted() {
    const spreadsheetId = "1kTyaxUD5Z3ZCFxaZn3C3PtFXJ5iKuAK1biOjFJUuZmk";
    const parser = new PublicGoogleSheetsParser();

    parser.parse(spreadsheetId, "Sheet1").then((items: any) => {
      const item = items[Math.floor(Math.random()*items.length)];
      this.question = item && item.question;

      console.log("items", items);
      console.log("items", item);
    });
  },
});
</script>

<style lang="scss">
$small: 360px;

.reservation__header {
  font-family: "Cabin Sketch", cursive;
  margin-bottom: 0;
  text-align: center;
  color: white;
  font-size: 50px;
  font-weight: bolder;
  padding: 10px;

  @media screen and (max-width: $small) {
    font-size: 30px;
  }
}

.reservation__subtitle {
  font-family: sans-serif;
  margin-bottom: 15px;
  text-align: center;
  color: white;
  font-size: 15px;
  font-weight: normal;
  font-style: italic;
  opacity: 0.8;

  @media screen and (max-width: $small) {
    font-size: 10px;
  }
}

.reservation__invalid-link {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cabin Sketch", cursive;
  font-size: 30px;
}

.reservation__body {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 30px;

  @media screen and (max-width: $small) {
    margin-top: 0;
  }
}

.booking-status--fully-paid {
  color: #81c784;
}

.booking-status--partially-paid {
  color: #ffb74d;
}

.booking-status--not-paid {
  color: #e57373;
}

.reservation__container {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5vh;
}
</style>

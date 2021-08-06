<template>
  <div class="reservation__container">
    <div v-if="!ticketDetails['Start Date'] && !invalidLink"></div>

    <div
      v-else-if="invalidLink || ticketDetails['Start Date'].includes('#')"
      class="reservation__invalid-link"
    >
      Invalid Link
    </div>

    <card
      v-else
      data-image="/img/86.jpg"
      :multiplier="ticketDetails['Name'].toUpperCase().length"
    >
      <div slot="header">
        <h1 class="reservation__header">Little Paradise Reservation</h1>

        <div class="reservation__subtitle">
          Post KM88, Marikina-Infanta Hwy, Brgy. Cueva, Santa Maria, Laguna
        </div>
        <div class="reservation__subtitle">+639154311099</div>
      </div>

      <div slot="content" class="reservation__body">
        <DescriptionItem>
          <template #label> Booking ID </template>
          <template #value>
            {{ bookingId }}
          </template>
        </DescriptionItem>

        <DescriptionItem>
          <template #label> Check-in date </template>
          <template #value>
            {{ ticketDetails["Start Date"].substring(0, 15).toUpperCase() }}
            {{ ticketDetails["Time In"].substring(15, 21).toUpperCase() }}
          </template>
        </DescriptionItem>

        <DescriptionItem>
          <template #label> Duration of stay </template>
          <template #value>
            {{ ticketDetails["Duration"].toUpperCase() }}
          </template>
        </DescriptionItem>

        <DescriptionItem>
          <template #label> Guest Name </template>
          <template #value>
            {{ ticketDetails["Name"].toUpperCase() }}
          </template>
        </DescriptionItem>

        <DescriptionItem>
          <template #label> Guest Count </template>
          <template #value>
            Maximum of {{ ticketDetails["Guest Count"].toUpperCase() }} people
          </template>
        </DescriptionItem>

        <DescriptionItem>
          <template #label> Booking Status </template>
          <template #value>
            <span :class="[bookingStatusClass]">
              {{ ticketDetails["Payment Status"].toUpperCase() }}
            </span>
          </template>
        </DescriptionItem>
      </div>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { doCipher } from "@/utils";
import Card from "@/components/Card.vue";
import DescriptionItem from "@/components/DescriptionItem.vue";
import isEmpty from "lodash/isEmpty";

export default Vue.extend({
  components: {
    Card,
    DescriptionItem,
  },
  data: () => {
    return {
      ticketDetails: {} as { [key: string]: string | number },
      invalidLink: false,
      bookingId: null as string | null,
    };
  },
  computed: {
    bookingStatusClass(): string {
      const paymentStatus: string =
        (this.ticketDetails["Payment Status"] as string) || "";

      if (paymentStatus.includes("not")) {
        return "booking-status--not-paid";
      }

      if (paymentStatus.includes("partially")) {
        return "booking-status--partially-paid";
      }

      if (paymentStatus.includes("fully")) {
        return "booking-status--fully-paid";
      }

      return "";
    },
  },
  mounted() {
    const spreadsheetId = "1Qdl6oePPqalgQS_XZ8voAkRuHH1bwSXtUhBDANsS7Cs";
    const parser = new PublicGoogleSheetsParser();
    const params = this.$route.params;
    let id;

    if (params && params.id) {
      id = params.id;
      this.bookingId = id;
    }

    if (id) {
      const [s, i] = id.split("_");

      parser.parse(spreadsheetId, "bookings").then((items: any) => {
        const reservationDetails = items.find(
          (item: any) => String(item.ID) === i
        );

        const reservationDetailsParsed: { [key: string]: string | number } = {};

        for (let value in reservationDetails) {
          reservationDetailsParsed[value] = doCipher(
            reservationDetails[value],
            s
          );
        }

        this.ticketDetails = reservationDetailsParsed;

        if (isEmpty(this.ticketDetails)) {
          this.invalidLink = true;
        }
      });
    }
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

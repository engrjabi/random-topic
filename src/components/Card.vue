<template>
  <div
    class="card-wrap"
    @mousemove="handleMouseMove"
    v-touch:moving="handleMouseMove"
    @mouseenter="handleMouseEnter"
    v-touch:start="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    v-touch:end="handleMouseLeave"
    ref="card"
  >
    <div class="card" :style="cardStyle">
      <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
      <div class="card-info">
        <slot name="header"></slot>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    dataImage: {
      type: String,
    },
    multiplier: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    width: 0 as number,
    height: 0 as number,
    mouseX: 0 as number,
    mouseY: 0 as number,
    mouseLeaveDelay: null,
  }),
  mounted() {
    const _this = this as any;
    _this.width = _this.$refs.card.offsetWidth as number;
    _this.height = _this.$refs.card.offsetHeight as number;
  },
  computed: {
    mousePX() {
      const _this = this as any;
      return _this.mouseX / _this.width;
    },
    mousePY() {
      const _this = this as any;
      return _this.mouseY / _this.height;
    },
    cardStyle() {
      const _this = this as any;
      const rX = _this.mousePX * (0.015 * window.screen.width);
      const rY = _this.mousePY * -(0.015 * window.screen.height);

      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
        height: `${_this.multiplier * 0.41}vh`,
        minHeight: `80vh`,
      };
    },
    cardBgTransform() {
      const _this = this as any;
      const tX = _this.mousePX * -(0.03 * window.screen.width);
      const tY = _this.mousePY * -(0.03 * window.screen.height);
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`,
      };
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`,
      };
    },
  },
  methods: {
    handleMouseMove(e: any) {
      const _this = this as any;
      let pageX = e.pageX;
      let pageY = e.pageY;

      if (e.pageX == null) {
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;
      }

      _this.mouseX = pageX - _this.$refs.card.offsetLeft - _this.width / 2;
      _this.mouseY = pageY - _this.$refs.card.offsetTop - _this.height / 2;
    },
    handleMouseEnter() {
      const _this = this as any;
      clearTimeout(_this.mouseLeaveDelay);
    },
    handleMouseLeave() {
      const _this = this as any;
      _this.mouseLeaveDelay = setTimeout(() => {
        _this.mouseX = 0;
        _this.mouseY = 0;
      }, 1000);
    },
  },
});
</script>

<style lang="scss">
$hoverEasing: cubic-bezier(0.23, 1, 0.32, 1);
$returnEasing: cubic-bezier(0.445, 0.05, 0.55, 0.95);
$small: 360px;

.card-wrap {
  margin: auto;
  transform: perspective(800px);
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
    .card-info {
      transform: translateY(0);
    }
    .card-info div {
      opacity: 1;
    }
    .card-info,
    .card-info div {
      transition: 0.6s $hoverEasing;
    }
    .card-info:after {
      transition: 5s $hoverEasing;
      opacity: 1;
    }
    .card-bg {
      transition: 0.6s $hoverEasing, opacity 5s $hoverEasing;
      opacity: 0.8;
    }
    .card {
      transition: 0.6s $hoverEasing, box-shadow 2s $hoverEasing;
      box-shadow: rgba(white, 0.2) 0 0 40px 5px, rgba(white, 1) 0 0 0 1px,
        rgba(black, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,
        inset white 0 0 0 6px;
    }
  }
}

.card {
  position: relative;
  flex: 0 0 40vw;
  width: 40vw;

  @media screen and (max-width: $small) {
    width: 95vw;
  }

  background-color: black;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: rgba(black, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,
    inset rgba(white, 0.5) 0 0 0 6px;
  transition: 1s $returnEasing;
}

.card-bg {
  opacity: 0.5;
  position: absolute;
  top: -20px;
  left: -20px;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: 1s $returnEasing, opacity 5s 1s $returnEasing;
  pointer-events: none;
}

.card-info {
  padding: 0;
  margin-bottom: 20px;
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  color: #fff;
  transform: translateY(-5%);

  @media screen and (max-width: $small) {
    transform: translateY(0);
  }

  transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);

  div {
    //opacity: 0;
    text-shadow: rgba(black, 1) 3px 3px 10px;
    transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  * {
    position: relative;
    z-index: 1;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(#000, 0.6) 100%
    );
    background-blend-mode: overlay;
    opacity: 0;
    transform: translateY(100%);
    transition: 5s 1s $returnEasing;
  }
}
</style>

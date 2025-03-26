import { defineNuxtPlugin } from "#app";
import * as echarts from "echarts";

export default defineNuxtPlugin((nuxtApp) => {
	if (process.client) {
		nuxtApp.provide("echarts", echarts);
	}
});

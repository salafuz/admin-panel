<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, h } from "vue";

// Type Definitions
export type TableColumn<T> = {
	key: keyof T;
	label: string;
	cell?: (row: T) => string | ReturnType<typeof h>;
	sortable?: boolean;
};

const props = defineProps<{
	data: Record<string, any>[];
	columns: TableColumn<Record<string, any>>[];
}>();

const emit = defineEmits<{
	(e: "update:sortedData", sortedData: Record<string, any>[]): void;
}>();

const sortKey = ref<string | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

const sortedData = computed(() => {
	if (!sortKey.value) return props.data;
	return [...props.data].sort((a, b) => {
		const aValue = a[sortKey.value as string];
		const bValue = b[sortKey.value as string];
		if (aValue === undefined || bValue === undefined) return 0;
		if (typeof aValue === "string" && typeof bValue === "string") {
			return sortOrder.value === "asc"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}
		return sortOrder.value === "asc" ? aValue - bValue : bValue - aValue;
	});
});

const sortByColumn = (key: string) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
	} else {
		sortKey.value = key;
		sortOrder.value = "asc";
	}
	emit("update:sortedData", sortedData.value);
};
</script>

<template>
	<div class="w-full">
		<UTable class="table" :data="sortedData">
			<UTableColumn
				v-for="column in props.columns"
				:key="column.key"
				:label="column.label"
				:sortable="column.sortable"
				@sort="() => sortByColumn(column.key)">
				<template #cell="{ row }">
					<component
						:is="
							column.cell ? column.cell(row) : row[column.key] ?? 'No Data'
						" />
				</template>
			</UTableColumn>
		</UTable>
	</div>
</template>

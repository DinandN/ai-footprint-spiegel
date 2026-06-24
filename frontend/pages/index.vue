<script setup lang="ts">
// Landing page (home): hero with the value proposition + CTAs and a decorative
// AI-process mock, followed by a band of sustainability facts.
</script>

<template>
  <!-- Hero -->
  <section
    class="afs-page-inner pb-12 pt-12 lg:pb-[72px] lg:pt-[65px]"
  >
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <!-- Left: copy + actions -->
      <div class="lg:col-span-5">
        <h1
          class="mb-7 max-w-none text-[clamp(40px,4.1vw,61px)] font-normal leading-none text-ink lg:max-w-[460px]"
        >
          Hoe groot is de voetafdruk van jouw
          <span class="font-semibold text-primary">AI-vraag?</span>
        </h1>
        <!-- 'Vegelijk' is exact overgenomen uit het Figma-design (typo in origineel). -->
        <p
          class="mb-10 max-w-none text-[clamp(18px,1.55vw,25px)] font-normal leading-[1.25] text-muted lg:max-w-[570px]"
        >
          Vegelijk welk AI-model het minste energie, water en CO₂ gebruikt voor
          precies dezelfde vraag.
        </p>
        <div class="flex flex-col gap-[22px]">
          <NuxtLink to="/challenger" class="afs-btn-cf afs-btn-cf-primary">
            <span>Vergelijk AI-Modellen</span>
            <IconArrow class="h-[22px] w-[22px] flex-none" />
          </NuxtLink>
          <NuxtLink to="/about" class="afs-btn-cf afs-btn-cf-outline">
            <span>Over Project &amp; Berekening</span>
            <IconArrow class="h-[22px] w-[22px] flex-none" />
          </NuxtLink>
        </div>
      </div>

      <!-- Right: AI process mock -->
      <div class="lg:col-span-7">
        <HeroProcessMock />
      </div>
    </div>
  </section>

  <!-- Facts band -->
  <section class="bg-form pb-14 pt-12">
    <div class="afs-page-inner">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FactCard
          highlight="3"
          title="minuten de lamp aan verbruikt evenveel energie als een ChatGPT-vraag"
          body="1 ChatGPT-vraag verbruikt ongeveer zoveel energie als een lamp in 3 minuten."
          source="Bron: Nafzger, D. 2026"
        >
          <NuxtLink
            to="/evolutie-ai"
            class="afs-btn-cf afs-btn-cf-primary mt-7"
          >
            <span>Ontdek AI-Historie &amp; Inzichten</span>
            <IconArrow class="h-[22px] w-[22px] flex-none" />
          </NuxtLink>
        </FactCard>

        <FactCard
          highlight="10x"
          title="meer water gebruik dan een google-zoekopdracht."
          body="AI gebruikt tot 10 keer meer water dan een Google-zoekopdracht."
          source="Bron: Obama, B. 2023"
          :source-light="true"
        />

        <FactCard
          title="189 Datacenters in Nederland sinds 2019"
          body="Het aantal datacenters groeit elk jaar verder."
          source="Bron: CBS. 2026"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Static content page: project background, what the artefact does, methodology
// and team. Standalone — no shared header/footer (matches the design).

definePageMeta({ layout: false });
</script>

<template>
  <main class="border-t-2 border-muted">
    <div class="mx-auto max-w-[960px] px-6 pb-14 pt-[30px] sm:px-12 sm:pb-24 lg:px-24">
      <!-- Terug naar home -->
      <NuxtLink to="/" class="afs-btn-back w-full sm:w-[300px]">
        <IconArrowLeft class="absolute left-[18px] h-[22px] w-[22px]" />
        <span>Terug naar Home</span>
      </NuxtLink>

      <h1
        class="mb-2 mt-11 text-[clamp(34px,3.6vw,50px)] font-normal leading-[1.1] text-ink"
      >
        Over Marazzi Explainable IT
      </h1>

      <div class="afs-prose">
        <section>
          <h2>Over Dit Project</h2>
          <p>
            Kunstmatige intelligentie speelt een steeds grotere rol in het
            dagelijks leven. Van het schrijven van teksten tot het analyseren van
            gegevens en het genereren van afbeeldingen: miljoenen mensen maken
            dagelijks gebruik van AI-systemen zonder stil te staan bij de middelen
            die hiervoor nodig zijn.
          </p>
          <p>
            Hoewel AI veel mogelijkheden biedt, brengt het gebruik ervan ook een
            ecologische impact met zich mee. Onze taalmodellen vereisen
            aanzienlijke hoeveelheden rekenkracht, energie en infrastructuur. Deze
            impact is vaak onzichtbaar voor gebruikers, waardoor het lastig is om
            bewuste keuzes te maken.
          </p>
          <p>
            Dit artefact is ontwikkeld om deze onzichtbare kant van AI inzichtelijk
            te maken. Door informatie over energieverbruik, waterverbruik en
            CO₂-uitstoot toegankelijk te presenteren, willen we bijdragen aan een
            beter begrip van de relatie tussen kunstmatige intelligentie en
            duurzaamheid.
          </p>
        </section>

        <section>
          <h2>Wat doet dit artefact?</h2>
          <p>
            Dit artefact maakt het mogelijk om verschillende AI-modellen met elkaar
            te vergelijken op basis van hun geschatte impact. Daarnaast laat het
            zien hoe keuzes van gebruikers, zoals het type model of de manier
            waarop een prompt wordt opgesteld, invloed kunnen hebben op het gebruik
            van digitale middelen.
          </p>
          <p>
            Het doel is niet om een model als beter of slechter aan te wijzen, maar
            om inzicht te geven in de afwegingen die gepaard gaan met het gebruik
            van AI. Door complexe informatie te vertalen naar begrijpelijke
            visualisaties en vergelijkingen wordt duurzaamheid concreter en beter
            bespreekbaar.
          </p>
        </section>

        <section>
          <h2>Hoe worden de resultaten bepaald?</h2>
          <p>
            De waarden die binnen dit artefact worden weergegeven zijn schattingen
            op basis van wetenschappelijke publicaties, onderzoeksrapporten en
            openbaar beschikbare gegevens over grote AI-modellen.
          </p>
          <p>
            Exacte cijfers zijn in de praktijk niet beschikbaar. Het daadwerkelijke
            energie- en waterverbruik van een AI-aanvraag hangt onder andere af van
            de gebruikte hardware, het datacenter, de energiemix en de complexiteit
            van de opdracht. De getoonde resultaten moeten daarom worden gezien als
            onderbouwde benaderingen die inzicht geven in de orde van grootte van de
            impact.
          </p>
          <p>
            Door gebruik te maken van meerdere bronnen en actuele onderzoeken
            proberen we een zo realistisch mogelijk beeld te geven van de relatie
            tussen AI-gebruik en duurzaamheid.
          </p>
        </section>

        <section>
          <h2>Over het team</h2>
          <!-- DYNAMIC (origineel): teamleden / begeleiding — hier als statische content -->
          <p>
            Dit project is ontwikkeld door Martijn Theeuwen, Luca Bosch, Dinand
            Nafzger en Jarno Muris als onderdeel van de opleiding HBO-ICT aan Zuyd
            Hogeschool.
          </p>
          <p>
            Het project is uitgevoerd binnen de casus Duurzame Technologie in Beeld
            en sluit aan bij het werk van het Lectoraat Data Intelligence. Vanuit
            hun fungeerde Koen Steeghs als aanspreekpunt gedurende het proces.
          </p>
          <p>
            Het uiteindelijke doel van dit artefact is om complexe informatie over
            AI en duurzaamheid begrijpelijk, toegankelijk en interactief te maken
            voor een breed publiek.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

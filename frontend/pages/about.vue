<script setup lang="ts">
// Static content page: project background, what the artefact does, methodology
// and team. Uses the default layout for the shared header + footer.
</script>

<template>
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
          dagelijks leven. Van het schrijven van teksten tot het maken van
          applicaties gebruiken miljoenen mensen en bedrijven AI-systemen zonder
          stil te staan bij de middelen die hiervoor nodig zijn. Hoewel AI
          voordelen brengt en mogelijkheden biedt, brengt het gebruik ook een
          grote impact op de natuur met zich mee. Grote modellen (LLM's) vereisen
          een aanzienlijke hoeveelheid energie en infrastructuur. Deze impact is
          vaak onzichtbaar voor gebruikers, waardoor het lastig is om bewuste
          keuzes te maken. Dit artefact is ontwikkeld om deze onzichtbare kant
          van AI inzichtelijk te maken.
        </p>
      </section>

      <section>
        <h2>Wat doet dit artefact?</h2>
        <p>
          Dit artefact maakt het mogelijk om verschillende AI-modellen met elkaar
          te vergelijken op basis van hun geschatte impact. Daarnaast laat het
          zien hoe keuzes van gebruikers, zoals het type model of de manier
          waarop een prompt wordt opgesteld, invloed kunnen hebben op het gebruik
          van digitale middelen. Het doel is niet om een model als beter of
          slechter aan te wijzen, maar om inzicht te geven in de afwegingen die
          hand in hand gaan met het gebruik van AI.
        </p>
      </section>

      <section>
        <h2>Hoe worden de resultaten bepaald?</h2>
        <p>
          De waarden die binnen dit artefact worden weergegeven zijn schattingen
          op basis van wetenschappelijke publicaties, onderzoeksrapporten en
          openbaar beschikbare gegevens over grote AI-modellen. Exacte cijfers
          zijn in de praktijk niet beschikbaar.
        </p>
        <p>
          Elke keer dat je een vraag stelt aan een AI, verbruikt dat achter de
          schermen stroom en water, en stoot het CO₂ uit. Omdat we geen directe
          toegang hebben tot de servers van de aanbieder, gebruiken we
          wetenschappelijk onderbouwde schattingsmethoden op basis van openbare
          gegevens.
        </p>

        <h3>Stap 1 – Van woorden naar stroom</h3>
        <p>
          Een AI verwerkt je tekst als losse stukjes, zogeheten tokens (grofweg
          een woord per token). Van elk token is bekend hoeveel stroom een model
          er gemiddeld voor nodig heeft. Hoe meer tokens je vraag en het antwoord
          samen bevatten, hoe meer stroom er verbruikt wordt. Een korte vraag met
          antwoord telt al snel zo'n 500 tokens, vergelijkbaar met het
          stroomverbruik van een LED-lamp gedurende vijf seconden.
        </p>

        <h3>Stap 2 – Van stroom naar CO₂</h3>
        <p>
          Niet alle stroom is even schoon. Stroom uit zonnepanelen stoot
          nauwelijks CO₂ uit, terwijl stroom uit een kolencentrale dat wel doet.
          Met een zogenaamde koolstofintensiteitsfactor rekenen we de verbruikte
          stroom om naar CO₂-uitstoot. Die factor verschilt per land en per
          datacenter; dezelfde AI-vraag kan daardoor in het ene land tot tien
          keer vervuilender zijn dan in het andere.
        </p>

        <h3>Stap 3 – Van stroom naar water</h3>
        <p>
          Servers worden warm en moeten gekoeld worden. Datacenters gebruiken
          daarvoor water. Hoe meer stroom er verbruikt wordt, hoe meer koeling er
          nodig is. Op basis van gemiddelde waterverbruikscijfers van grote
          datacenters schatten we hoeveel water jouw gebruik kost.
        </p>
      </section>

      <section>
        <h2>Methode en formules</h2>
        <p>
          De schatting is gebaseerd op de EcoLogits-methodiek (Rince et al.,
          2025), een open-source methode om de milieu-impact van AI-modellen in
          te schatten. Aanvullende factoren komen uit onderzoek naar het
          waterverbruik van datacenters (Li et al., 2023) en de CO₂-intensiteit
          van het Nederlandse stroomnet (CO2emissiefactoren.nl, 2025).
        </p>
        <p>
          Elke metric wordt per verzoek berekend uit het aantal invoer- en
          uitvoertokens (T<sub>in</sub> en T<sub>uit</sub>) en het aantal actieve
          parameters van het model (P<sub>actief</sub>, in miljarden). E staat
          voor het berekende energieverbruik.
        </p>

        <div class="afs-formula">
          <div class="afs-formula-title">Energie (Wh)</div>
          <div class="afs-formula-eq">
            E = T<sub>uit</sub> × (α × P<sub>actief</sub> + β) × PUE
          </div>
          <div class="afs-formula-note">
            α = 8,91 × 10⁻⁵ · β = 1,43 × 10⁻³ · PUE = 1,1 (cloud) of 1,0 (lokaal)
          </div>
        </div>

        <div class="afs-formula">
          <div class="afs-formula-title">CO₂ (g)</div>
          <div class="afs-formula-eq">CO₂ = E × CI</div>
          <div class="afs-formula-note">
            CI (koolstofintensiteit) = 0,418 kg/kWh (cloud) of 0,27 kg/kWh
            (Nederlands net, lokaal)
          </div>
        </div>

        <div class="afs-formula">
          <div class="afs-formula-title">Water (ml)</div>
          <div class="afs-formula-eq">W = E × WI</div>
          <div class="afs-formula-note">
            WI (waterintensiteit) = 1,8 L/kWh (cloud) of 0 (lokaal, luchtgekoeld)
          </div>
        </div>

        <div class="afs-formula">
          <div class="afs-formula-title">Kosten (€)</div>
          <div class="afs-formula-eq">
            cloud: kosten = (T<sub>in</sub> × prijs<sub>in</sub> + T<sub>uit</sub>
            × prijs<sub>uit</sub>) × wisselkoers
          </div>
          <div class="afs-formula-eq">lokaal: kosten = E × stroomtarief</div>
          <div class="afs-formula-note">
            Officiële tokenprijzen per model (USD, omgerekend met $1 = €0,92);
            lokale modellen tegen het stroomtarief (0,30 €/kWh).
          </div>
        </div>
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
          Het project is uitgevoerd onder de naam Duurzame Technologie in Beeld
          en sluit aan bij het werk van het Lectoraat Data Intelligence. Vanuit
          hen fungeerde Koen Steeghs als aanspreekpunt gedurende het project.
        </p>
      </section>
    </div>
  </div>
</template>

<template>
  <div class="LoadingSpinner flex justify-center items-center">
    <svg viewBox="0 0 50 50" class="h-5 w-5 fill-current" :aria-hidden="true">
      <path d="M8.5 15.7a18.68 18.68 0 1 0 32.7 18.1l-3.57-1.96a14.62 14.62 0 0 1-25.56-14.17L8.5 15.69z">
        <animateTransform 
					attributeType="xml" attributeName="transform"
					type="rotate"
					from="0 25 25" to="360 25 25"
					dur="0.6s"
					repeatCount="indefinite"
				/>
      </path>
    </svg>
    <span class="sr-only">Loading</span>
  </div>
</template>
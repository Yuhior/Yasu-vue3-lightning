<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header -->
		<header class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
			<div class="container mx-auto px-4 py-16 flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<i class="i-lucide:code-xml text-24" ></i>
					<h1 class="text-20 font-bold text-gray-800 dark:text-white">DevScaffold</h1>
				</div>

				<nav class="hidden md:flex items-center space-x-6">
					<a href="#components" class="text-gray-600 hover:text-primary text-20 dark:text-gray-300 dark:hover:text-primary-light transition">Components</a>
					<a href="#resources" class="text-gray-600 hover:text-primary text-20 dark:text-gray-300 dark:hover:text-primary-light transition">Resources</a>
					<a href="#docs" class="text-gray-600 hover:text-primary text-20 dark:text-gray-300 dark:hover:text-primary-light transition">Documentation</a>
				</nav>

				<div class="flex items-center space-x-4">
					<el-button @click="toggleTheme" class="p-2  hover: dark:hover:bg-gray-700 transition">
						<i class="i-material-symbols:wb-sunny-outline-rounded text-gray-600 dark:text-gray-300" v-if="isDark"></i>
						<i class="i-material-symbols:dark-mode-outline-rounded text-gray-600 dark:text-gray-300" v-else></i>
					</el-button>

				</div>
			</div>

			<!-- Mobile menu -->
			<div v-if="isMenuOpen" class="md:hidden bg-white dark:bg-gray-800 shadow-md">
				<div class="container mx-auto px-4 py-3 space-y-2">
					<a href="#components" class="block py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Components</a>
					<a href="#resources" class="block py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Resources</a>
					<a href="#docs" class="block py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Documentation</a>
				</div>
			</div>
		</header>

		<!-- Main content -->
		<main class="container mx-auto px-4 py-8">
			<!-- Hero section -->
			<section class="py-12 md:py-20 text-center">
				<h1 class="text-50  font-bold text-gray-900 dark:text-white mb-4">
					Frontend Developer Scaffold
				</h1>
				<p class="text-20 text-#4b5563 text-gray-600 dark:text-gray-300 max-w-768 mx-auto mb-8">
					A modern Vue 3 template with everything you need to start building amazing web applications.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<el-button class="px-10 py-6 !b-1 !b-primary bg-primary text-white rd-6 hover:bg-primary-dark transition shadow-md">
						Get Started
					</el-button>
					<el-button class="px-10 py-6 !b-1 bg-white dark:bg-gray-800 rd-6 text-gray-800 dark:text-white  hover:bg-gray-50 dark:hover:bg-gray-700 transition ">
						View Documentation
					</el-button>
				</div>
			</section>

			<!-- Stats section -->
			<section class="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div v-for="(stat, index) in stats" :key="index" class="bg-white dark:bg-gray-800 p-20 rounded-6 shadow-sm border border-gray-100 dark:border-gray-700">
					<div class="text-primary mb-2">
						<i :class="stat.icon" class="text-30" ></i>
					</div>
					<h3 class="text-14 font-bold text-gray-900 dark:text-white mb-1">{{ stat.value }}</h3>
					<p class="text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
				</div>
			</section>

			<!-- Components section -->
			<section id="components" class="py-12">
				<h2 class="text-20 font-bold text-gray-900 dark:text-white mb-20">Component Examples</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<!-- Card component -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
						<div class="p-20">
							<h3 class="text-20 font-semibold text-gray-900 dark:text-white mb-2">Card Component</h3>
							<p class="text-gray-600 dark:text-gray-400 mb-4">
								A versatile card component that can be used for various content types.
							</p>
							<button class=" b-0 px-6 py-4 bg-primary text-white rd-4 hover:bg-primary-dark transition text-14">
								View Details
							</button>
						</div>
						<div class="px-8 py-10 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 text-13 text-gray-500 dark:text-gray-400">
							Last updated: {{ formatDate(new Date()) }}
						</div>
					</div>

					<!-- Form component -->
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
						<div class="p-20">
							<h3 class="text-20 font-semibold text-gray-900 dark:text-white mb-4">Form Component</h3>

							<form @submit.prevent="handleSubmit" class="space-y-4">
								<div>
									<label class="block text-13 font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
									<el-input
										v-model="form.email"
										type="text"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
										placeholder="your@email.com"
									/>
								</div>

								<div>
									<label class="block text-13 font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
									<el-input
										type="textarea"
										v-model="form.message"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
										:rows="2"
										placeholder="Your message here..."
									></el-input>
								</div>

								<el-button  class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition text-sm">
									Submit Form
								</el-button>
							</form>
						</div>
					</div>
				</div>
			</section>

			<!-- Resources section -->
			<section id="resources" class="py-12">
				<h2 class="text-20 font-bold text-gray-900 dark:text-white mb-20">Developer Resources</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div v-for="(resource, index) in resources" :key="index" class="bg-white dark:bg-gray-800 p-20 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
						<div class="text-primary mb-3">
							<i :class="resource.icon" class="text-30"></i>
						</div>
						<h3 class="text-20 font-semibold text-gray-900 dark:text-white mb-2">{{ resource.title }}</h3>
						<p class="text-gray-600 dark:text-gray-400 text-14 mb-3">{{ resource.description }}</p>
						<a :href="resource.url" class="text-primary hover:text-primary-dark text-13 font-medium flex items-center">
							Learn more
							<i class="i-material-symbols:arrow-right-alt-rounded"></i>
						</a>
					</div>
				</div>
			</section>

			<!-- Newsletter section -->
		</main>

		<!-- Footer -->

	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Theme toggle
const isDark = ref(false);

const toggleTheme = () => {
	isDark.value = !isDark.value;
	if (isDark.value) {
		document.documentElement.classList.add('dark');
		localStorage.setItem('theme', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('theme', 'light');
	}
};

onMounted(() => {
	// Check for saved theme preference or prefer-color-scheme
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
		isDark.value = true;
		document.documentElement.classList.add('dark');
	}
});

// Mobile menu
const isMenuOpen = ref(false);

// Form state
const form = ref({
	email: '',
	message: ''
});

const handleSubmit = () => {
	console.log('Form submitted:', form.value);
	// Reset form
	form.value = {
		email: '',
		message: ''
	};
	alert('Form submitted successfully!');
};

// Newsletter
const newsletter = ref({
	email: ''
});

const subscribeNewsletter = () => {
	console.log('Newsletter subscription:', newsletter.value);
	newsletter.value.email = '';
	alert('Thanks for subscribing!');
};

// Stats data
const stats = [
	{
		icon: 'i-lucide:layers',
		value: '50+',
		label: 'UI Components'
	},
	{
		icon: 'i-material-symbols:supervisor-account-outline',
		value: '10k+',
		label: 'Active Developers'
	},
	{
		icon: 'i-iconoir:select-face-3d',
		value: '99.9%',
		label: 'Uptime Guarantee'
	}
];

// Resources data
const resources = [
	{
		icon: 'i-solar:notebook-minimalistic-bold',
		title: 'Documentation',
		description: 'Comprehensive guides and API references for all components.',
		url: '#'
	},
	{
		icon: 'i-tabler:brand-codepen',
		title: 'Component Library',
		description: 'Browse our collection of pre-built UI components.',
		url: '#'
	},
	{
		icon: 'i-material-symbols:file-copy-outline-rounded',
		title: 'Tutorials',
		description: 'Step-by-step tutorials to help you get started quickly.',
		url: '#'
	},
	{
		icon: 'i-mingcute:github-fill',
		title: 'GitHub Repository',
		description: 'Access the source code, report issues, and contribute.',
		url: '#'
	},
	{
		icon: 'i-teenyicons:users-outline',
		title: 'Community Forum',
		description: 'Join our community to get help and share your knowledge.',
		url: '#'
	},
	{
		icon: 'i-mage:box-3d-fill',
		title: 'Starter Templates',
		description: 'Ready-to-use templates for common application types.',
		url: '#'
	}
];

// Footer links
const footerLinks = {
	resources: [
		{ label: 'Documentation', url: '#' },
		{ label: 'Components', url: '#' },
		{ label: 'Tutorials', url: '#' },
		{ label: 'Blog', url: '#' }
	],
	company: [
		{ label: 'About Us', url: '#' },
		{ label: 'Careers', url: '#' },
		{ label: 'Contact', url: '#' },
		{ label: 'Partners', url: '#' }
	],
	legal: [
		{ label: 'Privacy Policy', url: '#' },
		{ label: 'Terms of Service', url: '#' },
		{ label: 'Cookie Policy', url: '#' },
		{ label: 'License', url: '#' }
	]
};

// Utility functions
const formatDate = (date) => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
};
</script>

<style>


/* Dark mode setup */
.dark {
	color-scheme: dark;
}

/* Smooth scrolling */
html {
	scroll-behavior: smooth;
}
</style>

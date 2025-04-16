import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Indian-inspired color palette
				turmeric: '#FEC006',
				maroon: '#850E35',
				saffron: '#FF671F',
				indianRed: '#CD5C5C',
				mehendi: '#5C9735',
				spiceYellow: '#FEF7CD',
				terracotta: '#E2725B',
				royalPurple: '#8B5CF6',
				peacockBlue: '#016064',
				bandhani: '#F1C0E8',
				paithani: '#FFBF00'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'spice-drift': {
                    '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
                    '25%': { transform: 'translate(5px, -5px) rotate(2deg)' },
                    '50%': { transform: 'translate(0px, -10px) rotate(0deg)' },
                    '75%': { transform: 'translate(-5px, -5px) rotate(-2deg)' },
                    '100%': { transform: 'translate(0px, 0px) rotate(0deg)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                },
                'rotate-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                'scale-up-down': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' }
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'spice-drift': 'spice-drift 6s ease infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'rotate-slow': 'rotate-slow 15s linear infinite',
                'scale-up-down': 'scale-up-down 5s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
			},
            fontFamily: {
                'spicefont': ['Poppins', 'sans-serif'],
                'heritage': ['Cormorant Garamond', 'serif'],
                'display': ['Playfair Display', 'serif']
            },
            backgroundImage: {
                'spice-pattern': "url('/src/assets/spice-pattern.png')",
                'fabric-texture': "url('/src/assets/fabric-texture.png')"
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

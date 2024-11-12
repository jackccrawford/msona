import React from 'react';
import { Github, Linkedin, Instagram, User, XSquare } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { siteConfig } from '../config/site';
import type { Theme } from '../types/Theme';

interface FooterProps {
  theme: Theme;
  isDark: boolean;
}

export function Footer({ theme, isDark }: FooterProps) {
  const { isScrolled } = useScrollPosition();

  const socialIcons = [
    { icon: Linkedin, href: siteConfig.author.links.linkedin, label: "LinkedIn" },
    { icon: XSquare, href: siteConfig.author.links.twitter, label: "X (Twitter)" },
    { icon: Instagram, href: siteConfig.author.links.instagram, label: "Instagram" },
    { icon: User, href: siteConfig.author.links.about, label: "About" },
    { icon: Github, href: siteConfig.author.links.github, label: "GitHub" }
  ];

  return (
    <footer className={`
      sticky bottom-0 mt-8 sm:mt-12 pb-2 sm:pb-4 text-center
      transition-all duration-300 transform
      ${isScrolled ? 'translate-y-full' : 'translate-y-0'}
    `}>
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <p className={`text-xs sm:text-sm ${isDark ? 'text-white/90' : `${theme.accent}/80`}`}>
            {siteConfig.tagline.creator} {siteConfig.author.name} {siteConfig.tagline.poweredBy}{' '}
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDark ? 'text-white hover:text-white/80' : `${theme.accent} ${theme.hover}`} transition-colors`}
            >
              {siteConfig.tagline.platform}
            </a>
          </p>
          <div className="flex gap-3 sm:gap-4">
            {socialIcons.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? 'text-white/80 hover:text-white' : `${theme.accent}/70 ${theme.hover}`} transition-colors`}
                title={label}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
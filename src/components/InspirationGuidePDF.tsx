import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Theme } from '../types/Theme';
import type { Quote } from '../types/Quote';

interface InspirationGuidePDFProps {
  quotes: Quote[];
  theme: Theme;
  isDark: boolean;
}

// Create styles with web-safe fonts
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  darkPage: {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  date: {
    fontSize: 12,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666666'
  },
  quoteContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA'
  },
  darkQuoteContainer: {
    backgroundColor: '#2D2D2D'
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4A5568'
  },
  darkTitle: {
    color: '#E2E8F0'
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 1.4
  },
  author: {
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
    color: '#718096'
  },
  darkAuthor: {
    color: '#A0AEC0'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 40,
    color: '#A0AEC0'
  }
});

export function InspirationGuidePDF({ quotes, theme, isDark }: InspirationGuidePDFProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={[styles.page, isDark && styles.darkPage]}>
        <Text style={styles.header}>Daily Inspiration Guide</Text>
        <Text style={styles.date}>{today}</Text>
        
        {quotes.map((quote) => (
          <View 
            key={quote.id} 
            style={[styles.quoteContainer, isDark && styles.darkQuoteContainer]}
          >
            <Text style={[styles.title, isDark && styles.darkTitle]}>
              {quote.title}
            </Text>
            <Text style={styles.content}>
              "{quote.content}"
            </Text>
            <Text style={[styles.author, isDark && styles.darkAuthor]}>
              — {quote.author}
            </Text>
          </View>
        ))}
        
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        />
      </Page>
    </Document>
  );
}
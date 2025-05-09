// // components/PdfDocument.jsx
// import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#ffffff',
//     padding: 20,
//     fontFamily: 'Helvetica'
//   },
//   header: {
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#d1d5db',
//     paddingBottom: 10
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#1f2937'
//   },
//   subtitle: {
//     fontSize: 12,
//     color: '#6b7280'
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 15,
//     backgroundColor: '#ffffff'
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#1f2937'
//   },
//   cardDescription: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginBottom: 10
//   },
//   table: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     marginBottom: 15
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#d1d5db'
//   },
//   tableHeader: {
//     width: '25%',
//     padding: 5,
//     fontWeight: 'bold',
//     backgroundColor: '#f3f4f6'
//   },
//   tableCell: {
//     width: '25%',
//     padding: 5
//   },
//   metricsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 15
//   },
//   metricCard: {
//     width: '48%',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 4,
//     padding: 10,
//     marginBottom: 10
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 4,
//     marginTop: 5,
//     marginBottom: 5
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4,
//     backgroundColor: '#1e40af'
//   },
//   swotContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 15
//   },
//   swotCard: {
//     width: '48%',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 4,
//     padding: 10,
//     marginBottom: 10
//   },
//   swotItem: {
//     flexDirection: 'row',
//     marginBottom: 5
//   },
//   swotBadge: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 4,
//     paddingHorizontal: 5,
//     marginRight: 5,
//     fontSize: 10
//   },
//   chartContainer: {
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   chartTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     textAlign: 'center'
//   },
//   barChart: {
//     flexDirection: 'row',
//     height: 200,
//     alignItems: 'flex-end',
//     justifyContent: 'space-around',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderColor: '#d1d5db'
//   },
//   bar: {
//     width: 40,
//     marginHorizontal: 10
//   },
//   barLabel: {
//     fontSize: 10,
//     textAlign: 'center',
//     marginTop: 5
//   },
//   pieChart: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   pieSlice: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 50,
//     marginHorizontal: 5
//   },
//   gaugeContainer: {
//     alignItems: 'center',
//     marginBottom: 15
//   },
//   gauge: {
//     width: 200,
//     height: 100,
//     borderTopLeftRadius: 100,
//     borderTopRightRadius: 100,
//     borderWidth: 10,
//     borderColor: '#1e40af',
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden'
//   },
//   gaugeFill: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#1e40af'
//   },
//   gaugeScore: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10
//   }
// });

// // Helper function to convert chart data to base64 images
// const ChartImage = ({ chartData, type }) => {
//   // In a real implementation, you would generate an image from the chart data
//   // For now, we'll just return null since we'll simulate the charts with PDF components
//   return null;
// };

// export default function MyDocument({ data }) {
//   const {
//     metrics,
//     swot,
//     past_scores,
//     past_dates,
//     success_score,
//     detailed_analysis,
//     final_verdict
//   } = data;

//   // Prepare data for visualizations
//   const metricsData = Object.entries(metrics).map(([key, value]) => ({
//     name: key.replace("_", " "),
//     score: value.score
//   }));

//   const swotData = Object.entries(swot).map(([key, value]) => ({
//     name: key,
//     value: value.length
//   }));

//   const COLORS = ["#F3F0E7", "#D6CBBE", "#C0B8A4", "#9A9285"];

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Idea Validation Report</Text>
//           <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
//         </View>

//         {/* Success Score - Gauge Chart */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Success Score</Text>
//           <Text style={styles.cardDescription}>
//             Overall score based on feasibility, market demand, scalability, and sustainability.
//           </Text>
//           <View style={styles.gaugeContainer}>
//             <View style={styles.gauge}>
//               <View style={[styles.gaugeFill, { height: `${success_score}%` }]} />
//             </View>
//             <Text style={styles.gaugeScore}>{success_score}%</Text>
//           </View>
//         </View>

//         {/* Final Verdict */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Final Verdict</Text>
//           <Text>{final_verdict}</Text>
//         </View>

//         {/* Past Scores */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Past Scores</Text>
//           <View style={styles.table}>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableHeader}>Date</Text>
//               <Text style={styles.tableHeader}>Score</Text>
//             </View>
//             {past_dates.slice(0, 5).map((date, index) => (
//               <View style={styles.tableRow} key={index}>
//                 <Text style={styles.tableCell}>{date}</Text>
//                 <Text style={styles.tableCell}>{past_scores[index]}%</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Metrics Grid */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Key Metrics</Text>
//           <View style={styles.metricsContainer}>
//             {Object.entries(metrics).map(([key, value]) => (
//               <View style={styles.metricCard} key={key}>
//                 <Text style={{ fontWeight: 'bold' }}>{key.replace("_", " ")}</Text>
//                 <Text style={{ fontSize: 10, marginBottom: 5 }}>{value.explanation}</Text>
//                 <View style={styles.progressBar}>
//                   <View style={[styles.progressFill, { width: `${value.score * 10}%` }]} />
//                 </View>
//                 <Text>{value.score}/10</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Bar Chart - Metrics Scores */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Metrics Scores</Text>
//           <Text style={styles.cardDescription}>
//             Visual representation of feasibility, market demand, scalability, and sustainability scores.
//           </Text>
//           <View style={styles.chartContainer}>
//             <View style={styles.barChart}>
//               {metricsData.map((metric, index) => (
//                 <View key={index} style={{ alignItems: 'center' }}>
//                   <View
//                     style={[
//                       styles.bar,
//                       {
//                         height: `${metric.score * 10}%`,
//                         backgroundColor: COLORS[index % COLORS.length]
//                       }
//                     ]}
//                   />
//                   <Text style={styles.barLabel}>{metric.name}</Text>
//                   <Text style={styles.barLabel}>{metric.score}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* SWOT Analysis */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>SWOT Analysis</Text>
//           <Text style={styles.cardDescription}>
//             Strengths, Weaknesses, Opportunities, and Threats
//           </Text>
//           <View style={styles.swotContainer}>
//             {Object.entries(swot).map(([key, items]) => (
//               <View style={styles.swotCard} key={key}>
//                 <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
//                 {items.map((item, index) => (
//                   <View style={styles.swotItem} key={index}>
//                     <Text style={styles.swotBadge}>{key}</Text>
//                     <Text>{item}</Text>
//                   </View>
//                 ))}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Pie Chart - SWOT Distribution */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>SWOT Distribution</Text>
//           <Text style={styles.cardDescription}>
//             Breakdown of strengths, weaknesses, opportunities, and threats.
//           </Text>
//           <View style={styles.pieChart}>
//             {swotData.map((item, index) => (
//               <View key={index} style={{ alignItems: 'center', marginHorizontal: 10 }}>
//                 <View
//                   style={[
//                     styles.pieSlice,
//                     {
//                       borderColor: COLORS[index % COLORS.length],
//                       transform: [{ rotate: `${index * 90}deg` }]
//                     }
//                   ]}
//                 />
//                 <Text>{item.name}: {item.value}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Detailed Analysis */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Detailed Analysis</Text>
//           <Text>{detailed_analysis}</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// }


// components/PdfDocument.jsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280'
  },
  card: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937'
  },
  cardDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db'
  },
  tableHeader: {
    width: '25%',
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6'
  },
  tableCell: {
    width: '25%',
    padding: 5
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  metricCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 5
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#1e40af'
  },
  swotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  swotCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10
  },
  swotItem: {
    flexDirection: 'row',
    marginBottom: 5
  },
  swotBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 5,
    marginRight: 5,
    fontSize: 10
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  barChart: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#d1d5db'
  },
  bar: {
    width: 40,
    marginHorizontal: 10
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5
  },
  pieChart: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  pieSlice: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 50,
    marginHorizontal: 5
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  gauge: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderWidth: 10,
    borderColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  gaugeFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1e40af'
  },
  gaugeScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },
  pageBreak: {
    marginBottom: 100 // Add extra space to force a page break
  }
});

export default function MyDocument({ data }) {
  const {
    metrics,
    swot,
    past_scores,
    past_dates,
    success_score,
    detailed_analysis,
    final_verdict
  } = data;

  // Prepare data for visualizations
  const metricsData = Object.entries(metrics).map(([key, value]) => ({
    name: key.replace("_", " "),
    score: value.score
  }));

  const swotData = Object.entries(swot).map(([key, value]) => ({
    name: key,
    value: value.length
  }));

  const COLORS = ["#F3F0E7", "#D6CBBE", "#C0B8A4", "#9A9285"];

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Idea Validation Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Success Score - Gauge Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Success Score</Text>
          <Text style={styles.cardDescription}>
            Overall score based on feasibility, market demand, scalability, and sustainability.
          </Text>
          <View style={styles.gaugeContainer}>
            <View style={styles.gauge}>
              <View style={[styles.gaugeFill, { height: `${success_score}%` }]} />
            </View>
            <Text style={styles.gaugeScore}>{success_score}%</Text>
          </View>
        </View>

        {/* Final Verdict */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Final Verdict</Text>
          <Text>{final_verdict}</Text>
        </View>

        {/* Past Scores */}
        <View style={[styles.card, styles.pageBreak]}>
          <Text style={styles.cardTitle}>Past Scores</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Date</Text>
              <Text style={styles.tableHeader}>Score</Text>
            </View>
            {past_dates.slice(0, 5).map((date, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{date}</Text>
                <Text style={styles.tableCell}>{past_scores[index]}%</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Second Page - Starts with Key Metrics */}
      <Page size="A4" style={styles.page}>
        {/* Metrics Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Metrics</Text>
          <View style={styles.metricsContainer}>
            {Object.entries(metrics).map(([key, value]) => (
              <View style={styles.metricCard} key={key}>
                <Text style={{ fontWeight: 'bold' }}>{key.replace("_", " ")}</Text>
                <Text style={{ fontSize: 10, marginBottom: 5 }}>{value.explanation}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${value.score * 10}%` }]} />
                </View>
                <Text>{value.score}/10</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bar Chart - Metrics Scores */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Metrics Scores</Text>
          <Text style={styles.cardDescription}>
            Visual representation of feasibility, market demand, scalability, and sustainability scores.
          </Text>
          <View style={styles.chartContainer}>
            <View style={styles.barChart}>
              {metricsData.map((metric, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${metric.score * 10}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }
                    ]}
                  />
                  <Text style={styles.barLabel}>{metric.name}</Text>
                  <Text style={styles.barLabel}>{metric.score}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        </Page>
        <Page size="A4" style={styles.page}>    
        {/* SWOT Analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SWOT Analysis</Text>
          <Text style={styles.cardDescription}>
            Strengths, Weaknesses, Opportunities, and Threats
          </Text>
          <View style={styles.swotContainer}>
            {Object.entries(swot).map(([key, items]) => (
              <View style={styles.swotCard} key={key}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                {items.map((item, index) => (
                  <View style={styles.swotItem} key={index}>
                    <Text style={styles.swotBadge}>{key}</Text>
                    <Text>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

      {/* Third Page - Continues with remaining content */}
      {/* <Page size="A4" style={styles.page}> */}
        {/* Pie Chart - SWOT Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SWOT Distribution</Text>
          <Text style={styles.cardDescription}>
            Breakdown of strengths, weaknesses, opportunities, and threats.
          </Text>
          <View style={styles.pieChart}>
            {swotData.map((item, index) => (
              <View key={index} style={{ alignItems: 'center', marginHorizontal: 10 }}>
                <View
                  style={[
                    styles.pieSlice,
                    {
                      borderColor: COLORS[index % COLORS.length],
                      transform: [{ rotate: `${index * 90}deg` }]
                    }
                  ]}
                />
                <Text>{item.name}: {item.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Detailed Analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detailed Analysis</Text>
          <Text>{detailed_analysis}</Text>
        </View>
      </Page>
    </Document>
  );
}
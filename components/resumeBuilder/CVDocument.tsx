import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import {
  PhoneIcon,
  EmailIcon,
  LocationIcon,
  LinkedInIcon,
  GitHubIcon,
  WebsiteIcon,
  BriefcaseIcon,
  GraduationIcon,
  CodeIcon,
  ToolsIcon,
  ProjectIcon,
  StarIcon,
  LightningIcon,
  TargetIcon
} from './Icons';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 8,
    fontFamily: 'Helvetica',
    fontSize: 7.5,
    maxHeight: 842,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    height: 825,
  },
  leftColumn: {
    flex: 2.2,
    height: '100%',
  },
  rightColumn: {
    flex: 1,
    height: '100%',
  },
  
  // Header styles
  header: {
    border: '1pt solid #e0e0e0',
    borderRadius: 6,
    padding: 8,
    marginBottom: 18,
    backgroundColor: '#ffffff',
    position: 'relative',
    height: 112,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#2c3e50',
    textAlign: 'center',
  },
  title: {
    fontSize: 9.5,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactIcon: {
    marginRight: 5,
  },
  contactText: {
    fontSize: 7,
    color: '#34495e',
  },
  socialLinksContainer: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    transform: 'translateX(-50%)',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    border: '1pt solid #e0e0e0',
  },
  socialIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    border: '1pt solid #dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceLabel: {
    fontSize: 7,
    color: '#2c3e50',
    fontFamily: 'Helvetica-Bold',
  },
  
  // Section styles
  section: {
    border: '1pt solid #e0e0e0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  aboutSection: {
    border: '1pt solid #e0e0e0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    height: 112,
  },
  experienceSection: {
    border: '1pt solid #e0e0e0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    position: 'relative',
    flex: 1,
  },
  experienceSectionInner: {
    paddingLeft: 10,
    position: 'relative',
  },
  continuousTimeline: {
    position: 'absolute',
    left: 12,
    top: 48,
    bottom: 8,
    width: 2,
    backgroundColor: '#3498db',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#2c3e50',
    paddingBottom: 5,
    borderBottom: '1pt solid #e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitleText: {
    marginLeft: 3,
  },
  
  // Experience styles
  experienceItem: {
    marginBottom: 3,
    position: 'relative',
    paddingLeft: 5,
  },
  timelineDotAbsolute: {
    position: 'absolute',
    left: -12,
    top: 1.5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    border: '2pt solid #3498db',
    zIndex: 3,
  },
  timelineDotInnerAbsolute: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3498db',
  },
  experienceContent: {
    paddingLeft: 0,
  },
  subRoleContainer: {
    marginTop: 4,
    marginBottom: 5,
    position: 'relative',
    paddingLeft: 0,
  },
  subTimelineDot: {
    position: 'absolute',
    left: -25,
    top: 1.5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ffffff',
    border: '1.5pt solid #95a5a6',
    zIndex: 3,
  },
  subTimelineDotInner: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#95a5a6',
  },
  subRoleContent: {
    paddingLeft: 0,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  companyName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#2c3e50',
    marginBottom: 3,
    marginTop: 0,
  },
  companyPeriod: {
    fontSize: 8.5,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  position: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#34495e',
    marginBottom: 3,
  },
  subPosition: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#34495e',
    marginBottom: 4,
  },
  period: {
    fontSize: 8,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  responsibility: {
    fontSize: 8,
    color: '#333',
    marginBottom: 4,
    paddingLeft: 7,
    textIndent: -7,
    lineHeight: 1.55,
  },
  bullet: {
    marginRight: 3,
  },
  
  // Skills styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5.6,
  },
  skillBadge: {
    border: '0.75pt solid #333',
    borderRadius: 3,
    padding: '2.5pt 6pt',
    fontSize: 6.5,
    color: '#333',
  },
  
  // About section
  aboutText: {
    fontSize: 8,
    color: '#333',
    lineHeight: 1.7,
    textAlign: 'justify',
    marginBottom: 2,
  },
  
  // Education
  educationDegree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  educationPeriod: {
    fontSize: 8,
    color: '#666',
    textAlign: 'right',
  },
  educationDetails: {
    fontSize: 8,
    color: '#333',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  
  // Projects
  projectName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  projectDescription: {
    fontSize: 8,
    color: '#333',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  projectDetail: {
    fontSize: 8,
    color: '#333',
    marginBottom: 4,
    paddingLeft: 7,
    textIndent: -7,
    lineHeight: 1.4,
  },
  
  // Open Source
  openSourceTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2c3e50',
    marginTop: 3,
    marginBottom: 3,
  },
  openSourceSubtitle: {
    fontSize: 8,
    color: '#666',
    marginBottom: 6,
  },
  contribution: {
    fontSize: 8,
    color: '#333',
    marginBottom: 4,
    paddingLeft: 7,
    textIndent: -7,
    lineHeight: 1.4,
  },
  
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  
  link: {
    color: '#3498db',
    textDecoration: 'none',
  }
});

interface CVData {
  personalInfo?: {
    name?: string;
    title?: string;
    experience?: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  about?: {
    title?: string;
    description?: string;
  };
  technicalExpertise?: string[];
  skills?: string[];
  methodology?: string[];
  tools?: string[];
  experience?: Array<{
    company?: string;
    companyPeriod?: string;
    roles?: Array<{
      position?: string;
      period?: string;
      responsibilities?: string[];
    }>;
  }>;
  openSource?: {
    title?: string;
    subtitle?: string;
    contributions?: string[];
  };
  education?: {
    degree?: string;
    period?: string;
    field?: string;
    institution?: string;
    location?: string;
    grade?: string;
  };
  projects?: Array<{
    name?: string;
    description?: string;
    details?: string[];
  }>;
}

interface CVDocumentProps {
  data: CVData;
}

const CVDocument: React.FC<CVDocumentProps> = ({ data }) => {
  // Helper to check if data exists and has content
  const hasData = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };

  // Helper to parse date string (e.g., "Sep 2020", "Jan 2025")
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const months: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    const parts = dateString.trim().toLowerCase().split(' ');
    if (parts.length >= 2) {
      const month = months[parts[0]];
      const year = parseInt(parts[1]);
      if (month !== undefined && !isNaN(year)) {
        return new Date(year, month, 1);
      }
    }
    return null;
  };

  // Calculate experience from earliest career start date
  const calculateExperience = (): string | null => {
    if (!data?.experience || !Array.isArray(data.experience)) {
      return null;
    }

    let earliestDate: Date | null = null;

    // Find the earliest start date from all experience entries
    data.experience.forEach((company) => {
      // Check company period (e.g., "Sep 2020 - Dec 2024")
      if (company.companyPeriod) {
        const periodParts = company.companyPeriod.split(' - ');
        if (periodParts.length > 0) {
          const startDate = parseDate(periodParts[0]);
          if (startDate && (!earliestDate || startDate < earliestDate)) {
            earliestDate = startDate;
          }
        }
      }

      // Check individual role periods
      if (company.roles && Array.isArray(company.roles)) {
        company.roles.forEach((role) => {
          if (role.period) {
            const periodParts = role.period.split(' - ');
            if (periodParts.length > 0) {
              const startDate = parseDate(periodParts[0]);
              if (startDate && (!earliestDate || startDate < earliestDate)) {
                earliestDate = startDate;
              }
            }
          }
        });
      }
    });

    if (!earliestDate) {
      return null;
    }

    // Calculate difference from earliest date to today
    const today = new Date();
    const earliest = earliestDate as Date;
    let years = today.getFullYear() - earliest.getFullYear();
    let months = today.getMonth() - earliest.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    // Format as "X years Y months"
    const yearText = years === 1 ? 'year' : 'years';
    const monthText = months === 1 ? 'month' : 'months';
    
    if (years === 0) {
      return `${months} ${monthText}`;
    } else if (months === 0) {
      return `${years} ${yearText}`;
    } else {
      return `${years} ${yearText} ${months} ${monthText}`;
    }
  };

  // Guard against undefined data
  if (!data || typeof data !== 'object') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>No valid CV data provided</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const personalInfo = data?.personalInfo || {};
  const hasSocialLinks = hasData(personalInfo?.linkedin) || hasData(personalInfo?.github) || hasData(personalInfo?.website);
  
  // Calculate experience automatically
  const calculatedExperience = calculateExperience();
  const displayExperience = calculatedExperience || personalInfo?.experience || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Header - Always show if personalInfo exists */}
            {hasData(personalInfo) && (
              <View style={styles.header}>
                {hasData(personalInfo.name) && <Text style={styles.name}>{personalInfo.name}</Text>}
                {hasData(personalInfo.title) && <Text style={styles.title}>{personalInfo.title}</Text>}
                
                <View style={styles.headerDivider} />
                
                <View style={styles.headerContent}>
                  <View style={styles.headerLeft}>
                    {hasData(personalInfo.phone) && (
                      <View style={styles.contactRow}>
                        <View style={styles.contactIcon}>
                          <PhoneIcon size={8} color="#34495e" />
                        </View>
                        <Text style={styles.contactText}>{personalInfo.phone}</Text>
                      </View>
                    )}
                    {hasData(personalInfo.email) && (
                      <View style={styles.contactRow}>
                        <View style={styles.contactIcon}>
                          <EmailIcon size={8} color="#34495e" />
                        </View>
                        <Text style={styles.contactText}>{personalInfo.email}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.headerRight}>
                    {hasData(personalInfo.location) && (
                      <View style={styles.contactRow}>
                        <View style={styles.contactIcon}>
                          <LocationIcon size={8} color="#34495e" />
                        </View>
                        <Text style={styles.contactText}>{personalInfo.location}</Text>
                      </View>
                    )}
                    {displayExperience && (
                      <View style={styles.contactRow}>
                        <Text style={styles.experienceLabel}>Experience: </Text>
                        <Text style={styles.contactText}>{displayExperience}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Floating Social Icons on Border */}
                {hasSocialLinks && (
                  <View style={styles.socialLinksContainer}>
                    {hasData(personalInfo.linkedin) && (
                      <Link src={`https://${personalInfo.linkedin}`}>
                        <View style={styles.socialIcon}>
                          <LinkedInIcon size={10} color="#0077b5" />
                        </View>
                      </Link>
                    )}
                    {hasData(personalInfo.github) && (
                      <Link src={`https://${personalInfo.github}`}>
                        <View style={styles.socialIcon}>
                          <GitHubIcon size={10} color="#333" />
                        </View>
                      </Link>
                    )}
                    {hasData(personalInfo.website) && (
                      <Link src={`https://${personalInfo.website}`}>
                        <View style={styles.socialIcon}>
                          <WebsiteIcon size={10} color="#3498db" />
                        </View>
                      </Link>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Professional Experience */}
            {hasData(data?.experience) && (
              <View style={styles.experienceSection}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <BriefcaseIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Professional Experience</Text>
                </View>
                
                {/* Continuous Timeline Line */}
                <View style={styles.continuousTimeline} />
                
                <View style={styles.experienceSectionInner}>
                  {data.experience?.map((company, companyIndex) => (
                    <View key={companyIndex} style={styles.experienceItem}>
                      {/* Main Dot */}
                      <View style={styles.timelineDotAbsolute}>
                        <View style={styles.timelineDotInnerAbsolute} />
                      </View>
                      
                      {/* Company Content */}
                      <View style={styles.experienceContent}>
                        {hasData(company?.company) && <Text style={styles.companyName}>{company.company}</Text>}
                        {hasData(company?.companyPeriod) && <Text style={styles.companyPeriod}>{company.companyPeriod}</Text>}
                        
                        {/* Roles within Company */}
                        {hasData(company?.roles) && company.roles?.map((role, roleIndex) => (
                          <View key={roleIndex} style={styles.subRoleContainer}>
                            {/* Role Content */}
                            <View style={styles.subRoleContent}>
                              {hasData(role?.position) && <Text style={styles.subPosition}>{role.position}</Text>}
                              {hasData(role?.period) && <Text style={styles.period}>{role.period}</Text>}
                              {hasData(role?.responsibilities) && role.responsibilities?.map((resp, idx) => (
                                <Text key={idx} style={styles.responsibility}>
                                  • {resp}
                                </Text>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Open Source Contributions */}
            {hasData(data?.openSource) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <StarIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Open Source Contributions</Text>
                </View>
                {hasData(data?.openSource?.title) && <Text style={styles.openSourceTitle}>{data.openSource?.title}</Text>}
                {hasData(data?.openSource?.subtitle) && <Text style={styles.openSourceSubtitle}>{data.openSource?.subtitle}</Text>}
                {hasData(data?.openSource?.contributions) && data.openSource?.contributions?.map((contribution, idx) => (
                  <Text key={idx} style={styles.contribution}>
                    • {contribution}
                  </Text>
                ))}
              </View>
            )}
          </View>
          
          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* About Me */}
            {hasData(data?.about) && (
              <View style={styles.aboutSection}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <CodeIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>{data?.about?.title || 'About Me'}</Text>
                </View>
                {hasData(data?.about?.description) && <Text style={styles.aboutText}>{data.about?.description}</Text>}
              </View>
            )}
            
            {/* Technical Expertise */}
            {hasData(data?.technicalExpertise) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <LightningIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Technical expertise</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {data.technicalExpertise?.map((skill, idx) => (
                    <View key={idx} style={styles.skillBadge}>
                      <Text>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Skills / Exposure */}
            {hasData(data?.skills) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <TargetIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Skills / Exposure</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {data.skills?.map((skill, idx) => (
                    <View key={idx} style={styles.skillBadge}>
                      <Text>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Methodology/Approach */}
            {hasData(data?.methodology) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <CodeIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Methodology/Approach</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {data.methodology?.map((method, idx) => (
                    <View key={idx} style={styles.skillBadge}>
                      <Text>{method}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Tools */}
            {hasData(data?.tools) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <ToolsIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Tools</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {data.tools?.map((tool, idx) => (
                    <View key={idx} style={styles.skillBadge}>
                      <Text>{tool}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Education */}
            {hasData(data?.education) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <GraduationIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Education</Text>
                </View>
                <View style={styles.educationHeader}>
                  {hasData(data?.education?.degree) && <Text style={styles.educationDegree}>{data.education?.degree}</Text>}
                  {hasData(data?.education?.period) && <Text style={styles.educationPeriod}>{data.education?.period}</Text>}
                </View>
                {hasData(data?.education?.field) && (
                  <Text style={styles.educationDetails}>{data.education?.field}</Text>
                )}
                {hasData(data?.education?.institution) && (
                  <Text style={styles.educationDetails}>{data.education?.institution}</Text>
                )}
                {(hasData(data?.education?.location) || hasData(data?.education?.grade)) && (
                  <Text style={styles.educationDetails}>
                    {[data?.education?.location, data?.education?.grade && `Grade: ${data.education?.grade}`].filter(Boolean).join(' | ')}
                  </Text>
                )}
              </View>
            )}
            
            {/* Personal Projects */}
            {hasData(data?.projects) && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <View style={styles.sectionIcon}>
                    <ProjectIcon size={9} color="#2c3e50" />
                  </View>
                  <Text style={styles.sectionTitleText}>Personal Projects</Text>
                </View>
                {data.projects?.map((project, idx) => (
                  <View key={idx}>
                    {hasData(project?.name) && <Text style={styles.projectName}>{project.name}</Text>}
                    {hasData(project?.description) && <Text style={styles.projectDescription}>{project.description}</Text>}
                    {hasData(project?.details) && project.details?.map((detail, detailIdx) => (
                      <Text key={detailIdx} style={styles.projectDetail}>
                        • {detail}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;


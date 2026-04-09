import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Hero from '../components/landing/Hero'
import Particles from '../components/magicui/particles'

export default function Home() {
  const {
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext()
  const { description } = customFields as { description: string }

  return (
    <Layout title={tagline} description={description}>
      <main>
        <Hero />
        <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />

      </main>
    </Layout>
  )
}

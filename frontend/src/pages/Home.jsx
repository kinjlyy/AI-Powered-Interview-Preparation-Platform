import { useEffect } from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import QuestionBank from '../components/QuestionBank'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import FAQ from '../components/FAQ'
import { testBackend } from '../api/testBackend'

const Home = () => {
  useEffect(() => {
    testBackend()
      .then((data) => {
        console.log(data.message)
      })
      .catch((error) => {
        console.error('Backend test failed', error)
      })
  }, [])

  return (
    <main className="space-y-0">
      <Hero />
      <Features />
      <HowItWorks />
      <QuestionBank />
      <Testimonials />
      <CTA />
      <FAQ />
    </main>
  )
}

export default Home




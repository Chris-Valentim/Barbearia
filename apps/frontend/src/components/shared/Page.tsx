import Footer from './Footer'

export interface PageProps {
  children: React.ReactNode
}

const Page = (props: PageProps) => {
  return (
    <div className='flex flex-col min-h-screen w-screen'>
      <main>
        {props.children}
      </main>
      <Footer />
    </div>
  )
}

export default Page

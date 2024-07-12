export function Header() {
  return (
    <div className='flex w-full fixed bg-[#0d1346] text-white px-3 py-5 z-10'>
      <ul className='flex w-full max-w-2xl gap-2 mx-auto justify-between items-center'>
        <li>
          <a
            href='#inicio'
            className='font-semibold hover:underline text-sm sm:text-base'
          >
            INICIO
          </a>
        </li>
        <li>
          <a
            href='#passos'
            className='font-semibold hover:underline text-sm sm:text-base'
          >
            PASSOS
          </a>
        </li>
        <li>
          <a
            href='#form'
            className='font-semibold hover:underline text-sm sm:text-base'
          >
            FORMULÁRIO
          </a>
        </li>
        <li>
          <a
            href='#regulamento'
            className='font-semibold hover:underline text-sm sm:text-base'
          >
            REGULAMENTO
          </a>
        </li>
      </ul>
    </div>
  )
}

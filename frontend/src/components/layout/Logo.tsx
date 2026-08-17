import logo from '../../assets/logo.svg'
export default function Logo(){
    return(
        <div className="flex items-center gap-x-2">
            <img src={logo} alt="logo" className='max-h-7' /> <h3 className='text-[20px] text-ink'>Stock Flow</h3>
        </div>
    )
}
export default function Navbar() {

  return (
    <header>
    <nav
       className="
         flex flex-wrap
         items-center
         justify-between
         w-full
         py-4
         md:py-0
         px-4
         text-7xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50
       "
     >
      <div className="text-bold text-2xl">
         <a href="/">
            ChatSight
         </a>
       </div>
      
      <div className="hidden w-full md:flex md:items-center md:w-auto" id="menu">
         <ul
           className="
             pt-4
             text-base
             md:flex
             md:justify-between 
             md:pt-0"
         >
           <li>
             <a className="md:p-4 py-2 block hover:text-purple-400" href="#"
               >About</a
             >
           </li>

         </ul>
       </div>
   </nav>
 </header>
  );
}